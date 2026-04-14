import { createCliRenderer, TextAttributes } from "@opentui/core";
import { createRoot, useKeyboard, useRenderer } from "@opentui/react";

function App() {
  const renderer = useRenderer();
  
  useKeyboard((key) => {
    if (key.name === "q" || key.name === "escape") {
      renderer.destroy();
    }
  });

  return (
    <box alignItems="center" justifyContent="center" flexGrow={1}>
      <box justifyContent="center" alignItems="flex-end">
        <ascii-font font="tiny" text="OpenTUI" />
        <text attributes={TextAttributes.DIM}>What will you build?</text>
        <text attributes={TextAttributes.DIM} marginTop={1}>
          Press 'q' or ESC to exit
        </text>
      </box>
    </box>
  );
}

const renderer = await createCliRenderer();
createRoot(renderer).render(<App />);
