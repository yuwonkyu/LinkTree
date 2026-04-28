import Section from "@/components/edit/Section";
import ThemeSelector from "@/components/dashboard/ThemeSelector";
import type { Theme } from "@/lib/types";

export type DesignTabProps = {
  theme: Theme;
  setTheme: (v: Theme) => void;
  plan?: string;
};

export default function DesignTab({ theme, setTheme, plan }: DesignTabProps) {
  return (
    <Section title="테마">
      <ThemeSelector selected={theme} onChange={setTheme} plan={plan} />
    </Section>
  );
}
