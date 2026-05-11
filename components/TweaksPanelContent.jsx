import { TweakRadio } from "./tweaks/TweakRadio.jsx";
import { TweakSection } from "./tweaks/TweakSection.jsx";
import { TweaksPanel } from "./tweaks/TweaksPanel.jsx";

export function TweaksPanelContent({ tweaks, setTweak }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection title="Sidebar">
        <TweakRadio
          value={tweaks.sidebar}
          onChange={(v) => setTweak("sidebar", v)}
          options={[
            { value: "expanded", label: "Expanded" },
            { value: "rail", label: "Icons only" },
          ]}
        />
      </TweakSection>
    </TweaksPanel>
  );
}
