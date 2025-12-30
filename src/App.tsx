import { useState } from "react";
import BottomBarComponent from "./components/BottomBarComponent";
import JuliaShader, {
  type JuliaShaderState,
} from "./shaders/JuliaShaderComponent";

// export const ShaderContext = createContext<{
//   shaderState: ShaderState | null;
//   setShaderState: React.Dispatch<React.SetStateAction<ShaderState | null>>;
// }>({
//   shaderState: null,
//   setShaderState: () => null,
// });

const App = () => {
  const [shaderState, setShaderState] = useState<JuliaShaderState>(
    JuliaShader.shaderDefaultState
  );
  const shaderProps = JuliaShader.shaderProps(shaderState);

  return (
    // <ShaderContext value={{ shaderState, setShaderState }}>
    <div
      className="w-full h-full bg-slate-950 relative overflow-hidden"
      onContextMenu={(e) => e.preventDefault()}
    >
      <JuliaShader.ShaderComponent
        shaderState={shaderState}
        setShaderState={setShaderState}
        shaderProps={shaderProps}
      />
      <BottomBarComponent
        shaderInfo={JuliaShader.shaderInfo}
        shaderState={shaderState}
        setShaderState={setShaderState}
        shaderProps={shaderProps}
      />
    </div>
    // </ShaderContext>
  );
};

export default App;
