import { useState, useCallback } from "react";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  clusterApiUrl,
} from "@solana/web3.js";
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { api } from "../api/client.js";

const RPC = import.meta.env.VITE_SOLANA_RPC || clusterApiUrl("devnet");

function getPhantom() {
  return window.phantom?.solana ?? (window.solana?.isPhantom ? window.solana : null);
}

export function usePhantomPay({ slug, onPaid }) {
  const [stage, setStage] = useState("ready");
  const [connectedAddr, setConnectedAddr] = useState(null);
  const [txSignature, setTxSignature] = useState(null);
  const [errMsg, setErrMsg] = useState(null);

  const phantom = getPhantom();

  const reset = useCallback(() => {
    setStage("ready");
    setErrMsg(null);
    setTxSignature(null);
  }, []);

  const pay = useCallback(
    async (link) => {
      if (!phantom) {
        window.open("https://phantom.app/", "_blank");
        return;
      }

      try {
        setStage("connecting");
        const { publicKey } = await phantom.connect();
        const senderPubkey = publicKey;
        setConnectedAddr(senderPubkey.toString());

        setStage("paying");

        const connection = new Connection(RPC, "confirmed");
        const recipientPubkey = new PublicKey(link.walletAddr);
        const transaction = new Transaction();

        if (link.token === "SOL") {
          const lamports = Math.round(Number(link.tokenAmount) * LAMPORTS_PER_SOL);
          transaction.add(
            SystemProgram.transfer({
              fromPubkey: senderPubkey,
              toPubkey: recipientPubkey,
              lamports,
            })
          );
        } else {
          const mintPubkey = new PublicKey(link.tokenAddress);
          const decimals = link.tokenDecimals ?? 6;
          const rawAmount = BigInt(Math.round(Number(link.tokenAmount) * 10 ** decimals));

          const senderAta = await getAssociatedTokenAddress(mintPubkey, senderPubkey);
          const recipientAta = await getAssociatedTokenAddress(mintPubkey, recipientPubkey);

          const recipientAtaInfo = await connection.getAccountInfo(recipientAta);
          if (!recipientAtaInfo) {
            transaction.add(
              createAssociatedTokenAccountInstruction(
                senderPubkey,
                recipientAta,
                recipientPubkey,
                mintPubkey
              )
            );
          }

          transaction.add(
            createTransferInstruction(
              senderAta,
              recipientAta,
              senderPubkey,
              rawAmount,
              [],
              TOKEN_PROGRAM_ID
            )
          );
        }

        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = senderPubkey;

        // Simulate before asking user to approve — catches balance errors early
        console.log("[PhantomPay] simulating transaction…");
        const sim = await connection.simulateTransaction(transaction);
        console.log("[PhantomPay] simulation logs:", sim.value.logs);
        if (sim.value.err) {
          console.error("[PhantomPay] simulation error:", sim.value.err);
          const logs = sim.value.logs?.join("\n") ?? "";
          if (/insufficient.*funds|insufficient.*lamports/i.test(logs + JSON.stringify(sim.value.err))) {
            throw new Error("Insufficient balance to complete this payment. Please top up your wallet.");
          }
          throw new Error(`Transaction simulation failed: ${JSON.stringify(sim.value.err)}`);
        }
        console.log("[PhantomPay] simulation ok — requesting Phantom approval");

        const { signature } = await phantom.signAndSendTransaction(transaction);
        setTxSignature(signature);

        setStage("confirming");
        await connection.confirmTransaction(
          { signature, blockhash, lastValidBlockHeight },
          "confirmed"
        );

        await api.confirmPayment(slug, {
          txHash: signature,
          paidWithToken: link.token,
        });

        setStage("success");
        onPaid?.();
      } catch (err) {
        const msg = err?.message || String(err);
        if (/user rejected|user denied|cancelled/i.test(msg)) {
          setStage("ready");
        } else {
          setErrMsg(msg);
          setStage("error");
        }
      }
    },
    [phantom, slug, onPaid]
  );

  return { stage, connectedAddr, txSignature, errMsg, phantom, pay, reset };
}
