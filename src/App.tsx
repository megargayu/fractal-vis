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
      <JuliaShader.shaderComponent
        shaderState={shaderState}
        setShaderState={setShaderState}
        shaderProps={shaderProps}
      />
      {/* <div className="absolute right-4 top-4 text-center bg-black/70 p-3 rounded-xl w-52">
          <h1 className="text-white font-serif font-bold">
            fractal-vis v0.0.1
          </h1>
          <h1 className="text-white font-mono">
            c: {formatNumber(c.x, 3)}, {formatNumber(c.y, 3)}
          </h1>
          <h1 className="text-white font-mono">
            zoom: {formatNumber(zoom, 3)}x
          </h1>
          <h1 className="text-white font-mono">
            offset: {formatNumber(shaderOffset.x, 3)},{" "}
            {formatNumber(shaderOffset.y, 3)}
          </h1>
          <h1 className="text-red-400 font-mono">
            raw: {formatNumber(dragPos.x, 3)}, {formatNumber(dragPos.y, 3)}
          </h1>
        </div> */}
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
