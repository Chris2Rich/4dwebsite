// @ts-nocheck
import { Canvas, useThree, useFrame } from "@react-three/fiber"
import { Html } from "@react-three/drei"
import React, { useEffect, useMemo, useRef, useState, useLayoutEffect } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"

const d4 = 2

function map3(tesseract: any) {
  
  const res = Array(4).fill().map(() => Array(4).fill().map(() => Array(3).fill(0)))

  for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
          const point4D = tesseract[i][j]
          
          const x = point4D[0] - 0.5
          const y = point4D[1] - 0.5
          const z = point4D[2] - 0.5
          const w = point4D[3] - 0.5
          
          const s = 1 / (d4 - w)
          
          res[i][j] = [
              x * s,
              y * s,
              z * s
          ]
      }
  }
  
  return res
}


function Point({ position, color = "#ffffff", size = 0.1 }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[size]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  )
}

function Line({ start, end, color="#0FF" }) {
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)]
  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  const material = new THREE.LineBasicMaterial({ color: color }) 

  return <line geometry={geometry} material={material}/>
}

function HyperCube({ position = [0,0,0], sv = [1,1,1], rt, display}){
  const origin = useRef([
    [[0,0,0,0],[0,0,0,1],[0,0,1,0],[0,0,1,1]],
    [[0,1,0,0],[0,1,0,1],[0,1,1,0],[0,1,1,1]],
    [[1,0,0,0],[1,0,0,1],[1,0,1,0],[1,0,1,1]],
    [[1,1,0,0],[1,1,0,1],[1,1,1,0],[1,1,1,1]]
  ].map(i => i.map(rw => rw.map(n => n - 0.5))))

  const [hyper_points, setHyper_Points] = useState(origin.current)
  useFrame((state) => {
    const angle = rt.current * 0.1 * state.clock.getElapsedTime()
    setHyper_Points(origin.current.map((layer) =>
      layer.map((point) => {
        const [x, y, z, w] = point
        const newX = x * Math.cos(angle) - w * Math.sin(angle)
        const newW = x * Math.sin(angle) + w * Math.cos(angle)

        const newY = y * Math.cos(angle) - z * Math.sin(angle)
        const newZ = y * Math.sin(angle) + z * Math.cos(angle)
        
        const scale = 1 / (2 - newW)
        
        return [newX * scale + position[0], newY * scale + position[1], newZ * scale + position[2], newW]
      })
    ))
  })

  const mappedPoints = map3(hyper_points).flat().map((rw) => {return rw.map((n, index) => {return n * sv[index]})})

  return <group>
    {mappedPoints.map((coords: any, index:any, arr:any) => (
      <Point key={index} position={coords} size={0.2} color={"#AEF"}/>
    ))}
    <Line start={mappedPoints[0]} end={mappedPoints[1]}/>
    <Line start={mappedPoints[0]} end={mappedPoints[2]}/>
    <Line start={mappedPoints[0]} end={mappedPoints[4]}/>
    <Line start={mappedPoints[0]} end={mappedPoints[8]}/>
    <Line start={mappedPoints[2]} end={mappedPoints[10]}/>
    <Line start={mappedPoints[2]} end={mappedPoints[6]}/>
    <Line start={mappedPoints[2]} end={mappedPoints[3]}/>
    <Line start={mappedPoints[4]} end={mappedPoints[6]}/>
    <Line start={mappedPoints[4]} end={mappedPoints[5]}/>
    <Line start={mappedPoints[6]} end={mappedPoints[7]}/>
    <Line start={mappedPoints[8]} end={mappedPoints[10]}/>
    <Line start={mappedPoints[8]} end={mappedPoints[12]}/>
    <Line start={mappedPoints[8]} end={mappedPoints[9]}/>
    <Line start={mappedPoints[10]} end={mappedPoints[11]}/>
    <Line start={mappedPoints[10]} end={mappedPoints[14]}/>
    <Line start={mappedPoints[12]} end={mappedPoints[13]}/>
    <Line start={mappedPoints[12]} end={mappedPoints[14]}/>
    <Line start={mappedPoints[12]} end={mappedPoints[4]}/>
    <Line start={mappedPoints[14]} end={mappedPoints[6]}/>
    <Line start={mappedPoints[14]} end={mappedPoints[15]}/>
    <Line start={mappedPoints[7]} end={mappedPoints[5]}/>
    <Line start={mappedPoints[7]} end={mappedPoints[3]}/>
    <Line start={mappedPoints[7]} end={mappedPoints[15]}/>
    <Line start={mappedPoints[5]} end={mappedPoints[13]}/>
    <Line start={mappedPoints[5]} end={mappedPoints[1]}/>
    <Line start={mappedPoints[15]} end={mappedPoints[13]}/>
    <Line start={mappedPoints[15]} end={mappedPoints[11]}/>
    <Line start={mappedPoints[11]} end={mappedPoints[9]}/>
    <Line start={mappedPoints[9]} end={mappedPoints[1]}/>
    <Line start={mappedPoints[1]} end={mappedPoints[3]}/>
    <Line start={mappedPoints[9]} end={mappedPoints[13]}/>
    <Line start={mappedPoints[11]} end={mappedPoints[3]}/>

    <QHtml points={[mappedPoints[0], mappedPoints[4], mappedPoints[12], mappedPoints[8]]} rt={rt} display={display}>
      <div style={{ width: "100%", height: "100%", background: "#FFF", color: "white", borderRadius: "100%", alignItems: "center"}}>
        <a href={"https://github.com/chris2rich"}><svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[9], mappedPoints[13], mappedPoints[5], mappedPoints[1]]} rt={rt} display={display}>
      <div style={{ width: "100%", height: "100%", background: "blue", padding: "50px", color: "white", borderRadius: "75px", display: "flex", alignItems: "center", textAlign: "center"}}>
        <p style={{fontSize: "150px"}}>Age: 17</p>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[12], mappedPoints[13], mappedPoints[5], mappedPoints[4]]} rt={rt} display={display}>
      <div style={{ width: "100%", height: "100%", background: "green", padding: "50px", color: "white", borderRadius: "75px", display: "flex", alignItems: "center", textAlign: "center"}}>
        <p style={{fontSize: "150px"}}>This is a hypercube!</p>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[9], mappedPoints[8], mappedPoints[0], mappedPoints[1]]} rt={rt} display={display}>
      <div style={{ width: "100%", height: "100%", background: "cyan", padding: "50px", color: "white", borderRadius: "75px", display: "flex", alignItems: "center", textAlign: "center"}}>
        <a style={{fontSize: "150px"}} href={"https://raterandoms.vercel.app"}>Face Rating Website</a>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[9], mappedPoints[8], mappedPoints[12], mappedPoints[13]]} rt={rt} display={display}>
      <div style={{ width: "100%", height: "100%", background: "yellow", padding: "50px", color: "black", borderRadius: "75px", display: "flex", alignItems: "center", textAlign: "center"}}>
        <a style={{fontSize: "150px"}} href={"https://thecharitybutton.com/"}>Charity Website</a>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[4], mappedPoints[0], mappedPoints[1], mappedPoints[5]]} rt={rt} display={display}>
      <div style={{ width: "100%", height: "100%", background: "orange", padding: "50px", color: "white", borderRadius: "75px", display: "flex", alignItems: "center", textAlign: "center"}}>
        <p style={{fontSize: "150px"}}>GCSEs: 9999988887</p>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[6], mappedPoints[4], mappedPoints[0], mappedPoints[2]]} rt={rt} display={display}>
      <div style={{ width: "100%", height: "100%", background: "magenta", padding: "50px", color: "white", borderRadius: "75px", display: "flex", alignItems: "center", textAlign: "center"}}>
        <p style={{fontSize: "150px"}}>Languages: C/++, PY, JS, Go</p>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[7], mappedPoints[3], mappedPoints[1], mappedPoints[5]]} rt={rt} display={display}>
      <div style={{ width: "100%", height: "100%", background: "black", padding: "50px", color: "white", borderRadius: "75px", display: "flex", alignItems: "center", textAlign: "center"}}>
        <p style={{fontSize: "150px"}}>Interests: CS, ML, FP, Quant Fin</p>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[2], mappedPoints[0], mappedPoints[1], mappedPoints[3]]} rt={rt} display={display}>
      <div style={{ width: "100%", height: "100%", background: "white", padding: "50px", color: "black", borderRadius: "75px", display: "flex", alignItems: "center", textAlign: "center"}}>
        <a style={{fontSize: "150px"}} href={"https://gitlab.com/personal4984242/testlang"}>My Programming Language (indev)</a>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[4], mappedPoints[6], mappedPoints[7], mappedPoints[5]]} rt={rt} display={display}>
      <div style={{ width: "100%", height: "100%", background: "turquoise", padding: "50px", color: "white", borderRadius: "75px", display: "flex", alignItems: "center", textAlign: "center"}}>
        <p style={{fontSize: "150px"}}>A Levels: Ma, FM, Phys, CS</p>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[6], mappedPoints[7], mappedPoints[3], mappedPoints[2]]} rt={rt} display={display}>
      <div style={{ width: "100%", height: "100%", background: "grey", padding: "50px", color: "white", borderRadius: "75px", display: "flex", alignItems: "center", textAlign: "center"}}>
        <p>XMR TO THE MOON</p>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[10], mappedPoints[14], mappedPoints[6], mappedPoints[2]]} rt={rt} display={display}>
      <div style={{ width: "100%", height: "100%", background: "#D000F", padding: "50px", color: "white", borderRadius: "75px", display: "flex", alignItems: "center", textAlign: "center"}}>
        <a href={"https://gitlab.com/chris2rich"}><img style={{width: "1000px", height: "1000px"}} src={"https://www.vectorlogo.zone/logos/gitlab/gitlab-tile.svg"}></img></a>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[3], mappedPoints[7], mappedPoints[15], mappedPoints[11]]} rt={rt} display={display}>
      <div style={{ width: "100%", height: "100%", background: "#414141", padding: "50px", color: "white", borderRadius: "75px", display: "flex", alignItems: "center", textAlign: "center"}}>
        <a href={"https://leetcode.com/u/c2rdev/"}><img style={{width: "1000px", height: "1000px"}} src={"https://upload.wikimedia.org/wikipedia/commons/8/8e/LeetCode_Logo_1.png"}></img></a>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[6], mappedPoints[7], mappedPoints[15], mappedPoints[14]]} rt={rt} display={display}>
      <div style={{ width: "100%", height: "100%", background: "indigo", padding: "50px", color: "white", borderRadius: "75px", display: "flex", alignItems: "center", textAlign: "center"}}>
        <a href={"https://moneyviz.vercel.app/"} style={{fontSize: "150px"}}>Cloud Data Manipulation (indev)</a>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[3], mappedPoints[2], mappedPoints[10], mappedPoints[11]]} rt={rt} display={display}>
      <div style={{ width: "100%", height: "100%", background: "salmon", padding: "50px", color: "white", borderRadius: "75px", display: "flex", alignItems: "center", textAlign: "center"}}>
        <p style={{fontSize: "150px"}}>Dev OS: Debian 12</p>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[15], mappedPoints[14], mappedPoints[10], mappedPoints[11]]} rt={rt} display={display}>
      <div className="text-white bg-gradient-to-b from-blue-500 to-purple-500 drop-shadow-md shadow-indigo-500" style={{ width: "100%", height: "100%", padding: "50px", borderRadius: "75px", display: "flex", alignItems: "center", textAlign: "center"}}> 
        <a href={"/"} style={{fontSize: "150px"}}>Hypercube Portfolio Page</a>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[10], mappedPoints[8], mappedPoints[12], mappedPoints[14]]} rt={rt} display={display}>
      <div style={{ width: "100%", height: "100%", background: "navy", padding: "50px", color: "white", borderRadius: "75px", display: "flex", alignItems: "center", textAlign: "center"}}>
      <img style={{width: "1000px", height: "1000px"}} src={"https://upload.wikimedia.org/wikipedia/commons/8/8d/Christian_Cross_icon.svg"}></img>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[15], mappedPoints[13], mappedPoints[9], mappedPoints[11]]} rt={rt} display={display}>
      <div style={{ width: "100%", height: "100%", background: "papayawhip", padding: "50px", color: "black", borderRadius: "75px", alignItems: "center", textAlign: "center", overflow: "scroll", scrollbarWidth: "none"}}>
        <p style={{fontSize: "150px"}}>This is html inside a panel!</p>
        <button style={{fontSize: "45px"}} className="p-2 mt-1 text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl drop-shadow-md transition-all hover:text-yellow-400 hover:scale-105 shadow-indigo-500">Click me?</button>
        <p style={{fontSize: "45px"}}>if you wish then you can scroll but you will see lorem ipsum after a while. i dont know about how im going to keep slelling porperl y but fi uoy kan stull reed ths than u lan dpwak z resl lanfuahe. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis congue sagittis enim, eget iaculis orci euismod vel. Quisque id neque sed libero pellentesque commodo. Maecenas ultricies tellus magna, vel malesuada erat dapibus at. Donec tincidunt quam sed risus dictum convallis. Mauris sit amet turpis dolor. Nullam fringilla bibendum dui pretium dictum. Nullam porttitor semper felis, et aliquam ex suscipit quis. Cras in velit consectetur, finibus leo sit amet, consectetur enim. Aenean consequat justo sed est dignissim hendrerit hendrerit sed mi. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Integer quis molestie nibh. Donec nibh dolor, interdum eu metus nec, gravida facilisis nulla. Cras quis auctor metus, a elementum orci. Aliquam quis venenatis turpis. Nulla varius fringilla rhoncus. Nunc sapien mauris, imperdiet commodo tellus et, molestie egestas nunc. In eu magna maximus, mollis enim in, facilisis quam. Nulla faucibus posuere molestie. Morbi ornare fermentum odio vel vulputate. Vivamus cursus egestas sapien ac maximus. Sed at aliquet est. Praesent tincidunt orci ex, vitae condimentum libero feugiat nec. Quisque lobortis sem augue, sit amet congue justo condimentum sed. Mauris placerat porttitor velit, nec sollicitudin nisl ornare vitae. Ut dapibus orci ut elit pretium tristique. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nullam ac orci suscipit, porta nunc eu, commodo sem. Proin varius id diam sit amet egestas. Phasellus tempus aliquam ipsum, at malesuada massa accumsan vel. Curabitur id mollis eros. Nullam tellus velit, luctus eget malesuada ac, mollis vitae libero. Quisque in dui elementum, gravida neque et, luctus nulla. In at justo aliquam, ullamcorper ipsum non, blandit nisl.</p>
        <iframe width="100%" height="66%" src="https://www.youtube.com/embed/O6pzSeQlSbY" />
        <p style={{fontSize: "45px"}}>Dream car ^^^</p>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[14], mappedPoints[12], mappedPoints[13], mappedPoints[15]]} rt={rt} display={display}>
      <div style={{ width: "100%", height: "100%", background: "crimson", padding: "50px", color: "white", borderRadius: "75px", display: "flex", alignItems: "center", textAlign: "center"}}>
        <a style={{fontSize: "150px"}} href={"mailto:cz07business:gmail.com"}>Email Me!</a>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[11], mappedPoints[9], mappedPoints[8], mappedPoints[10]]} rt={rt} display={display}>
      <div style={{ width: "100%", height: "100%", background: "#D000F", padding: "50px", color: "white", borderRadius: "75px", display: "flex", alignItems: "center", textAlign: "center"}}>
      <a href={"https://www.linkedin.com/in/chris-z-35a639324/"}><img style={{width: "1000px", height: "1000px"}} src={"https://store-images.s-microsoft.com/image/apps.31120.9007199266245564.44dc7699-748d-4c34-ba5e-d04eb48f7960.bc4172bd-63f0-455a-9acd-5457f44e4473"}></img></a>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[5], mappedPoints[13], mappedPoints[15], mappedPoints[7]]} rt={rt} display={display}>
      <div style={{ width: "100%", height: "100%", background: "seagreen", padding: "50px", color: "white", borderRadius: "75px", display: "flex", alignItems: "center", textAlign: "center"}}>
        <p style={{fontSize: "150px"}}>Fluent in: English, French</p>
      </div>
    </QHtml>
    <QHtml points={[mappedPoints[9], mappedPoints[1], mappedPoints[3], mappedPoints[11]]} rt={rt} display={display}>
      <div style={{ width: "100%", height: "100%", background: "lightskyblue", padding: "50px", color: "black", borderRadius: "75px", display: "flex", alignItems: "center", textAlign: "center"}}>
        <p style={{fontSize: "150px"}}>Target Course: CS</p>
      </div>
    </QHtml>
  </group>
}

function QHtml({ points, rt, display, children }) {
  const offset = useMemo(()=>{return Math.random()}, 1)
  const groupRef = useRef()
  const htmlRef = useRef()
  const [euler, setEuler] = useState(new THREE.Euler())
  const [scale, setScale] = useState(1)

    const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const vertices = new Float32Array(points.flat())
    const indices = new Uint16Array([0, 1, 2, 2, 3, 0])
    g.setAttribute("position", new THREE.BufferAttribute(vertices, 3))
    g.setIndex(new THREE.BufferAttribute(indices, 1))
    g.computeVertexNormals()
    return g
  }, [points])

    const center = useMemo(() => {
    const x = points.reduce((sum, point) => sum + point[0], 0) / 4
    const y = points.reduce((sum, point) => sum + point[1], 0) / 4
    const z = points.reduce((sum, point) => sum + point[2], 0) / 4
    return new THREE.Vector3(x, y, z);
  }, [points])

    const normal = useMemo(() => {
    const v1 = new THREE.Vector3(...points[1]).sub(new THREE.Vector3(...points[0]))
    const v2 = new THREE.Vector3(...points[3]).sub(new THREE.Vector3(...points[0]))
    return new THREE.Vector3().crossVectors(v1, v2).normalize()
  }, [points])

    useFrame((state) => {
    if (groupRef.current && htmlRef.current) {
            groupRef.current.position.copy(center)

            const rotationMatrix = new THREE.Matrix4()
      rotationMatrix.lookAt(center, center.clone().add(normal), new THREE.Vector3(0, 1, 0))
      const scale = new THREE.Vector3()
      const position = new THREE.Vector3()
      const t_euler = new THREE.Euler()
      rotationMatrix.decompose(position, t_euler, scale)
      setEuler(t_euler)

      setScale(((!rt.current * 1) + (rt.current * Math.sin(offset + 0.05 * state.clock.getElapsedTime()))) * display.current)
    }
  })

  return (
    <group>
      <mesh geometry={geometry}>
        <meshBasicMaterial opacity={!display.current * 0.1} color={"#8CD"} transparent side={THREE.DoubleSide} />
      </mesh>

      <group ref={groupRef}>

        <Html
          ref={htmlRef}
          transform
          distanceFactor={1}
          position={[0, 0, 0]}
          rotation={euler}
          scale={scale}
          style={{
            width: "1000px",
            height: "1000px",
            transformOrigin: "center center",
            pointerEvents: "auto",
          }}
          className="blur-lg transition-all duration-200 hover:scale-110 hover:filter hover:blur-none"
        >
          {children}
        </Html>
      </group>
    </group>
  )
}


function CameraController() {
  const { camera, gl } = useThree()
  useEffect(
    () => {
      const controls = new OrbitControls(camera, gl.domElement)

      controls.minDistance = 3
      controls.maxDistance = 20
      return () => {
        controls.dispose()
      }
    },
    [camera, gl]
  )
  return null
}

function FPSLimiter({ fps }) {
  const set = useThree((state) => state.set);
  const get = useThree((state) => state.get);
  const advance = useThree((state) => state.advance);
  const frameloop = useThree((state) => state.frameloop);

  useLayoutEffect(() => {
      const initFrameloop = get().frameloop;

      return () => {
          set({ frameloop: initFrameloop });
      };
  }, []);

  useFrame((state) => {
      if (state.get().blocked) return;
      state.set({ blocked: true });

      setTimeout(() => {
          state.set({ blocked: false });

          state.advance();
      }, Math.max(0, 1000 / fps - state.clock.getDelta()));
  });

  useEffect(() => {
      if (frameloop !== 'never') {
          set({ frameloop: 'never' });
          advance();
      }
  }, [frameloop]);

  return null;
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return <script>window.location.reload()</script>
    }

    return this.props.children;
  }
}

function App() {
  
  const canvasRef = useRef()


  useEffect(() => {
    const handleContextLost = (event) => {
      event.preventDefault()
      console.log("WebGL context lost, reloading the page.")
      throw("error")
    }

    const canvas = canvasRef.current
    if (canvas) {
      const gl = canvas.getContext('webgl2')
      if (!gl) {
        console.error("WebGL2 context not available, falling back to WebGL1.")
      } else {
        console.log("WebGL2 context created successfully.")
      }

      canvas.addEventListener('webglcontextlost', handleContextLost)
    }

    return () => {
      const canvas = canvasRef.current
      if (canvas) {
        canvas.removeEventListener('webglcontextlost', handleContextLost)
      }
    }
  }, [])

  const rt = useRef(1)
  const display = useRef(1)
  const [framerate, setframerate] = useState(15)
  
  return (
    <div className="w-full h-screen">
      <div className="absolute top-2 left-1/2 z-50 p-2 text-center rounded-xl drop-shadow-lg -translate-x-1/2 bg-neutral-300 shadow-black">
      <p className="md">This is a hypercube!<br />Some faces are clickable links.<br /> Chris2Rich: <a className="text-blue-500 underline" href="https://github.com/chris2rich">Github</a></p>
      </div>
      <div className="flex absolute bottom-2 left-1/2 z-50 items-center p-2 text-center rounded-xl drop-shadow-lg -translate-x-1/2 bg-neutral-300 shadow-black"><div><p className="md">Left Mouse: Rotate Camera<br /> Right Mouse: Move Camera</p></div>
<div className="ml-4">      <button className="p-2 mt-1 text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl drop-shadow-md transition-all hover:text-yellow-400 hover:scale-105 shadow-indigo-500" onClick={() => {rt.current = (rt.current == 0)}}>Toggle Rotation</button><br />
<button className="p-2 mt-1 text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl drop-shadow-md transition-all shadow-indigo-500 hover:text-yellow-400 hover:scale-105" onClick={() => {display.current = (display.current == 0)}}>Toggle Panels</button>
</div>
      </div>
        <ErrorBoundary>
        <Canvas camera={{ position: [3, 3, 3], fov: 75 }} style={{ background: "#212121" }} frameloop={"demand"} ref={canvasRef}  pixelRatio={window.devicePixelRatio * 0.125} shadowMap={{ enabled: false}}>
        <FPSLimiter fps={framerate} />
        <CameraController />
        <ambientLight intensity={1} />
        <HyperCube sv={[25,25,25]} position={[.5,.5,.5]} rt={rt} display={display}/>
        </Canvas>
      </ErrorBoundary>
    </div>
  )
}

export default App
