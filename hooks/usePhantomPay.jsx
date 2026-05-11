import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../api/client.js";

export function usePhantomPay({ slug, onPaid }) {
  const [stage, setStage] = useState("ready");
  const [connectedAddr, setConnectedAddr] = useState("");
  const [txSignature, setTxSignature] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const phantom =
    window.phantom?.solana ?? (window.solana?.isPhantom ? window.solana : null);

  const confirmMutation = useMutation({
    mutationFn: ({ txHash }) => api.confirmPayment(slug, { txHash }),
    onSuccess: (updated) => {
      setStage("success");
      onPaid?.(updated.id);
    },
    onError: (e) => {
      setStage("error");
      setErrMsg("Payment sent but confirmation failed: " + (e.message || "unknown error"));
    },
  });

  const pay = async (link) => {
    if (!phantom) {
      window.open("https://phantom.app/", "_blank");
      return;
    }
    if (!link?.walletAddr) {
      setStage("error");
      setErrMsg("Merchant has not configured a payout wallet.");
      return;
    }

    setErrMsg("");
    try {
      setStage("connecting");
      const { publicKey: fromPubkey } = await phantom.connect();
      setConnectedAddr(fromPubkey.toBase58());

      setStage("paying");

      const { Connection, Transaction, SystemProgram, PublicKey, LAMPORTS_PER_SOL } =
        await import("@solana/web3.js");

      /** Phantom’s key object is not always the same class as web3.js `PublicKey`. */
      const fromPk = new PublicKey(fromPubkey.toBase58());

      const connection = new Connection('https://devnet.helius-rpc.com/?api-key=17609122-00e3-42ca-9727-b1a213ce5cbb', "confirmed");
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");

      const toPubkey = new PublicKey(String(link.walletAddr).trim());
      const tx = new Transaction();
      tx.recentBlockhash = blockhash;
      tx.feePayer = fromPk;

      if (link.token === "SOL") {
        tx.add(
          SystemProgram.transfer({
            fromPubkey: fromPk,
            toPubkey,
            lamports: Math.round(link.tokenAmount * LAMPORTS_PER_SOL),
          }),
        );
      } else {
        const mintStr = link.tokenAddress && String(link.tokenAddress).trim();
        if (!mintStr) {
          throw new Error("Missing token mint for this payment link. Refresh the page or contact the merchant.");
        }
        const { getAssociatedTokenAddress, createTransferInstruction } = await import("@solana/spl-token");
        const mintPubkey = new PublicKey(mintStr);
        const fromAta = await getAssociatedTokenAddress(mintPubkey, fromPk);
        const toAta = await getAssociatedTokenAddress(mintPubkey, toPubkey);
        const decimals = Number.isFinite(link.tokenDecimals) ? link.tokenDecimals : 6;
        const rawAmt = BigInt(Math.round(link.tokenAmount * 10 ** decimals));
        tx.add(createTransferInstruction(fromAta, toAta, fromPk, rawAmt));
      }

      const { signature } = await phantom.signAndSendTransaction(tx);
      setTxSignature(signature);
      setStage("confirming");

      const { value } = await connection.confirmTransaction(
        { signature, blockhash, lastValidBlockHeight },
        "confirmed",
      );
      if (value.err) throw new Error("Transaction reverted on chain.");

      confirmMutation.mutate({ txHash: signature });
    } catch (e) {
      if (e?.code === 4001 || /rejected|cancelled/i.test(e?.message ?? "")) {
        setStage("ready");
        return;
      }
      setStage("error");
      setErrMsg(e?.message ?? "Payment failed.");
    }
  };

  const reset = () => {
    setStage("ready");
    setErrMsg("");
  };

  return { stage, connectedAddr, txSignature, errMsg, phantom, pay, reset };
}
