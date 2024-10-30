import React, { useEffect, useState, useCallback } from "react";
import Particles from "react-particles";
import { loadFull } from "tsparticles";

import VantaEffect from "./VantaEffect";
// import ParticleImage, {ParticleOptions} from "react-particle-image";

const LayoutContainer = ({ className = " animate-fadeIn", children }) => {
	const [ready, setReady] = useState(false);
	const particlesInit = useCallback(async (engine) => {
		console.log(engine);
		// you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
		// this loads the tsparticles package bundle, it's the easiest method for getting everything ready
		// starting from v2 you can add only the features you need reducing the bundle size
		await loadFull(engine);
	}, []);

	const particlesLoaded = useCallback(async (container) => {
		await console.log(container);
	}, []);

	useEffect(() => {
		console.log("MOUNTTT");
		setTimeout(() => {
			setReady(true);
		}, 200);
	}, []);

	// const particleOptions: ParticleOptions = {
	// 	filter: ({ x, y, image }) => {
	// 	  // Get pixel
	// 	  const pixel = image.get(x, y);
	// 	  // Make a particle for this pixel if blue > 50 (range 0-255)
	// 	  return pixel.b > 50;
	// 	},
	// 	color: ({ x, y, image }) => "#61dafb"
	//   };
	return (
		<div
			className={`h-[100dvh] w-screen overflow-auto flex flex-col lg:flex-row px-2 justify-center items-center ${className}`}
		>
	{/* <ParticleImage
      src={"/react-logo.png"}
      scale={0.75}
      entropy={20}
      maxParticles={4200}
      particleOptions={particleOptions}
    /> */}
	
			{/* <img
				src="/b1.jpg"
				className="fixed top-0 left-0 w-[125%] h-[125%] opacity-75 object-cover z-[1]"
			/> */}

			{/* <div
				className="z-[1] pointer-events-none fixed h-[100dvh]  w-full top-0 left-0
	 opacity-50
"
			>
				{ready && (
					<Particles
						id="tsparticles"
						init={particlesInit}
						loaded={particlesLoaded}
						options={{
							background: {
								color: {
									value: "transparent",
								},
							},
							fpsLimit: 30,
							fullScreen: {
								enable: true,
								zIndex: 0,
							},
							interactivity: {
								events: {
									onClick: {
										enable: false,
										mode: "push",
									},
									onHover: {
										enable: false,
										mode: "repulse",
									},
									resize: false,
								},
								modes: {
									bubble: {
										distance: 400,
										duration: 2,
										opacity: 0.8,
										size: 40,
									},
									push: {
										quantity: 10,
									},
									repulse: {
										distance: 200,
										duration: 1,
									},
								},
							},
							particles: {
								color: {
									value: "#ffffff",
								},
								links: {
									color: "#ffffff",
									distance: 150,
									enable: true,
									opacity: 0.6,
									width: 1,
								},
								collisions: {
									enable: true,
								},
								move: {
									direction: "none",
									enable: true,
									outMode: "bounce",
									random: false,
									speed: 0.5,
									straight: false,
								},
								number: {
									density: {
										enable: true,
										area: 800,
									},
									value: 100,
								},
								opacity: {
									value: 0.5,
								},
								shape: {
									type: "circle",
								},
								size: {
									random: true,
									value: 3,
								},
							},
							detectRetina: true,
						}}
					/>
				)}
			</div> */}

			{children}
		</div>
	);
};

export default LayoutContainer;
