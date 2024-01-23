import React, { useState } from "react";
import { ReactP5Wrapper } from "@p5-wrapper/react";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_KEY,
  dangerouslyAllowBrowser: true,
});

function App() {
  //States
  //For Main App
  const [generationDone, setGenerationDone] = useState(false);
  const [prompt, setPrompt] = useState(null);
  const [image, setImage] = useState(null);
  //For P5 Canvas
  const [brush, setBrush] = useState(null);
  const [color, setColor] = useState("#000");
  const [objectBrushSets, setObjectBrushSets] = useState(null);
  const [hexColors, setHexColors] = useState(null);

  //P5 canvas
  function sketch(p5) {
    let brushset = null;
    let colorlist = null;
    let currentBrush = null;
    let currentColor = "#000";

    p5.updateWithProps = (props) => {
      if (props.objectBrushSets) {
        console.log(props.objectBrushSets);
        brushset = props.objectBrushSets;
        createBrushUI(brushset);
      }
      if (props.hexColors) {
        console.log(props.hexColors);
        colorlist = props.hexColors;
        createColorUI(colorlist);
      }
    };

    p5.setup = () => {
      p5.createCanvas(600, 400, p5.WEBGL);
      p5.background("#E6E6FA");
    };

    function createBrushUI(brushset) {
      const brushContainersHolder = p5.createDiv("");
      brushContainersHolder.position(10, 410);
      brushContainersHolder.style("display", "flex");
      brushContainersHolder.style("flex-direction", "row");
      brushContainersHolder.style("align-items", "center");

      let xPosition = 0; // Start position for the first brush container

      Object.entries(brushset).forEach(([object, brushArray], index) => {
        // Create a container for each emoji and its brushes
        const brushContainer = p5.createDiv("");
        brushContainer.parent(brushContainersHolder);
        brushContainer.position(xPosition, 0);
        brushContainer.style("display", "flex");
        brushContainer.style("flex-direction", "row");
        brushContainer.style("align-items", "center");
        brushContainer.style("margin-right", "24px");

        // Create a paragraph for the emoji
        const emojiPara = p5.createP(object);
        emojiPara.parent(brushContainer);
        emojiPara.style("font-size", "24px");

        // Create buttons for each brush
        const brushButtonContainer = p5.createDiv("");
        brushButtonContainer.parent(brushContainer);
        brushButtonContainer.style("display", "flex");
        brushButtonContainer.style("flex-direction", "column");

        brushArray.forEach((brush) => {
          const brushButton = p5.createButton(brush);
          brushButton.parent(brushButtonContainer);
          brushButton.style("background-color", "#000");
          brushButton.style("color", "white");
          brushButton.style("border-radius", "0.5rem");
          brushButton.style("padding", "0.5rem 1.5rem");
          brushButton.mousePressed(() => {
            console.log("I'm clicked! " + brush);
            setCurrentBrush(brush);
          });
        });

        xPosition += 145; // Adjust xPosition for the next set
      });
    }

    function createColorUI(colorlist) {
      const colorButtonContainer = p5.createDiv("");
      colorButtonContainer.position(245, 510); // Position below the brush containers
      colorButtonContainer.style("display", "flex");
      colorButtonContainer.style("flex-direction", "row");

      colorlist.forEach((color, index) => {
        // Create a div for the color button
        const colorDiv = p5.createDiv("");
        colorDiv.parent(colorButtonContainer);
        colorDiv.style("background-color", color);
        colorDiv.style("height", "30px");
        colorDiv.style("width", "30px");
        colorDiv.style("border-radius", "100px");
        colorDiv.style("cursor", "pointer");
        colorDiv.style(
          "margin-right",
          index < colorlist.length - 1 ? "16px" : "0"
        );

        // Event handling for color change
        colorDiv.mousePressed(() => {
          console.log("Color selected:", color);
          setCurrentColor(color);
        });
      });
    }

    function setCurrentBrush(brushArray) {
      currentBrush = brushArray;
      console.log("Current brush:", currentBrush);
    }

    function setCurrentColor(color) {
      currentColor = p5.color(color);
      console.log("Current color:", currentColor);
    }

    p5.draw = () => {
      console.log(brush);
      console.log(p5.mouseX, p5.mouseY);

      if (p5.mouseIsPressed) {
        if (currentBrush === "leafBrush") {
          console.log("here");
          leafBrush();
        } else if (currentBrush === "splatter") {
          splatter();
        } else if (currentBrush === "wiggle") {
          wiggle();
        } else if (currentBrush === "hatching") {
          hatching();
        } else if (currentBrush === "feather") {
          feather();
        } else if (currentBrush === "beads") {
          beads();
        }
      }
    };

    function leafBrush() {
      // Set the color for the leaves
      currentColor.setAlpha(150);
      p5.fill(currentColor);
      p5.noStroke();

      // Calculate the angle of the mouse movement
      const angle = Math.atan2(p5.mouseY - p5.pmouseY, p5.mouseX - p5.pmouseX);

      // Find the distance between current and previous mouse points
      const distance = p5.dist(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);

      // Create a leaf-like shape using ellipses
      for (let i = 0; i < distance; i += 5) {
        const size = p5.random(5, 10); // Randomize the leaf size for a natural look
        const xOffset = p5.random(-5, 5); // Randomize x offset for variability
        const yOffset = p5.random(-5, 5); // Randomize y offset for variability

        p5.push(); // Save the current drawing state
        p5.translate(p5.mouseX - 300 + xOffset, p5.mouseY - 200 + yOffset); // Translate to the new position
        p5.rotate(angle + p5.random(-p5.PI / 4, p5.PI / 4)); // Rotate the leaf at different angles
        p5.ellipse(0, 0, size, size * 2); // Draw the leaf shape
        p5.pop(); // Restore the original drawing state
      }
    }

    function feather() {
      // set the color and brush style
      currentColor.setAlpha(150);
      p5.fill(currentColor);
      p5.noStroke();

      // move the origin (0,0) to the current mouse point
      p5.translate(p5.mouseX - 300, p5.mouseY - 200);

      // find the angle of the direction the mouse is moving in
      // then rotate the canvas by that angle
      const angle = Math.atan2(p5.mouseY - p5.pmouseY, p5.mouseX - p5.pmouseX);
      p5.rotate(angle);

      // set minumum width and height of the toothpick-shaped ellipse
      const minSize = 4;

      // find the distance between current mouse point and previous mouse point
      const distance = p5.dist(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);

      // draw the toothpick-shaped ellipse
      p5.ellipse(0, 0, distance * 2 + minSize, minSize);
    }

    function wiggle() {
      // set the color and brush style
      currentColor.setAlpha(255);
      p5.stroke(currentColor);
      p5.strokeWeight(2);
      p5.noFill();

      // find the distance between the current and previous mouse points
      const distance = p5.dist(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);

      // find the midpoint between the current and previous mouse points
      const midX = (p5.mouseX - 300 + p5.pmouseX - 300) / 2;
      const midY = (p5.mouseY - 200 + p5.pmouseY - 200) / 2;

      // find the angle of the direction the mouse is moving in
      const angle = Math.atan2(p5.mouseY - p5.pmouseY, p5.mouseX - p5.pmouseX);

      // find which way to flip the arc
      const flip = (p5.frameCount % 2) * p5.PI;

      // draw the arc as a half circle
      p5.arc(
        midX,
        midY,
        distance,
        distance,
        angle + flip,
        angle + p5.PI + flip
      );
    }

    function splatter() {
      // set the color and brush style
      currentColor.setAlpha(160);
      p5.stroke(currentColor);
      p5.strokeWeight(4);

      // set the number of times we lerp the point in the for loop
      const lerps = 8;

      // repeat the point with lerping
      for (let i = 0; i < lerps; i++) {
        // find lerped x and y coordinates of the point
        const x = p5.lerp(p5.mouseX - 300, p5.pmouseX - 300, i / lerps + lerps);
        const y = p5.lerp(p5.mouseY - 200, p5.pmouseY - 200, i / lerps + lerps);

        // draw a point
        p5.point(x, y);
      }
    }

    function hatching() {
      // set the color and brush style
      currentColor.setAlpha(220);
      p5.stroke(currentColor);
      p5.strokeWeight(1);

      // calculate the speed of the mouse
      let speed =
        p5.abs(p5.mouseX - p5.pmouseX) + p5.abs(p5.mouseY - p5.pmouseY);

      // make a vector by inverting X and Y values
      const vector = p5.createVector(
        p5.mouseY - p5.pmouseY,
        p5.mouseX - p5.pmouseX
      );

      // set the vector magnitude (the line length) based on the mouse speed
      vector.setMag(speed / 2);

      // set the number of times we lerp the line
      const lerps = 3;

      // repeat the line with lerping
      for (let i = 0; i < lerps; i++) {
        // find the lerped X and Y coordinates
        const x = p5.lerp(p5.mouseX - 300, p5.pmouseX - 300, i / lerps);
        const y = p5.lerp(p5.mouseY - 200, p5.pmouseY - 200, i / lerps);

        // draw a line
        p5.line(x - vector.x, y - vector.y, x + vector.x, y + vector.y);
      }
    }

    function beads() {
      // set the color and brush style
      currentColor.setAlpha(180);
      p5.fill(currentColor);
      p5.noStroke();

      // find the distance between the current and previous mouse points
      const distance = p5.dist(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);

      // find the midpoint between the current and previous mouse points
      const midX = (p5.mouseX - 300 + p5.pmouseX - 300) / 2;
      const midY = (p5.mouseY - 200 + p5.pmouseY - 200) / 2;

      // draw a circle at the midpoint, with distance as its diameter
      p5.circle(midX, midY, distance);
    }
  }

  //Functions
  const handleGenerate = async () => {
    console.log("generation started");
    console.log(prompt);
    let response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });
    console.log(response);
    setImage(response.data[0].url);
    getInspo(response.data[0].url);
  };

  async function getInspo(image) {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: 'List the distinct elements in the image in the form of JSON {object1: [brush1, brush2]}, where the brush can effectively depict the object. Keep it within 5 objects. the collection of brushes are (splatter, wiggle, hatching, leafBrush, feather, beads). For the objects, use emojis instead of words. Then, generate a list of 6 colors [color1, color2, ...., color6] found in the above 5 objects. return in the form of a JavaScript list of hex codes, like in this example: ```json{"🌲": ["leafBrush", "wiggle"],"🍄": ["hatching"],"🌟": ["splatter"],"💧": ["beads"],"🌱": ["feather"]}``` ```javascript["#3A5F0B", "#C02942", "#8E8CD8", "#4A8BFF", "#FCD123", "#F9F4D7"]```',
            },
            {
              type: "image_url",
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
      max_tokens: 300,
    });
    console.log(response.choices[0].message.content);

    //PURE CHAOS
    // Extracting the JSON part and the array part
    let [jsonPart, arrayPartWithComments] = response.choices[0].message.content
      .split("}\n")
      .map((part, index) => (index === 0 ? part + "}" : part));
    console.log(jsonPart);
    console.log(arrayPartWithComments);
    jsonPart = jsonPart.replace(/.*\n?```json\n?/, "").replace(/\n?```?$/, "");
    arrayPartWithComments = arrayPartWithComments.match(
      /```javascript\s*(\[.*?\])\s*```/
    )[1];
    console.log(jsonPart);
    console.log(arrayPartWithComments);
    const data = JSON.parse(jsonPart);
    const data2 = JSON.parse(arrayPartWithComments);
    console.log("Brush Data:", data);
    console.log("Color Data:", data2);
    setObjectBrushSets(data);
    setHexColors(data2);
    setGenerationDone(true);
  }

  //Components
  function ObjectSingleSet({ object, brushes }) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <div style={{ marginRight: "24px", marginBottom: "24px" }}>
          <p style={{ fontSize: "24px" }}>{object}</p>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {brushes.map((brush, index) => (
              <button
                onClick={(e) => {
                  console.log("I'm clicked!" + e.target.innerText);
                  setBrush(e.target.innerText);
                }}
                style={{
                  backgroundColor: "#000",
                  color: "white", // text-white
                  borderRadius: "0.5rem", // rounded-lg
                  padding: "0.5rem 1.5rem", // px-6 py-2
                }}
              >
                {brush}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function BrushPanel({ objectBrushSets }) {
    return (
      <div style={{ marginLeft: "20px" }}>
        <div>
          <strong>Brushes</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          {Object.entries(objectBrushSets).map(([object, brushes], index) => (
            <ObjectSingleSet object={object} brushes={brushes} />
          ))}
        </div>
      </div>
    );
  }

  function ColorPanel({ hexColors }) {
    return (
      <div style={{ marginLeft: "20px" }}>
        <div>
          <strong>Color Picker</strong>
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: "16px" }}>
          {hexColors.map((color, index) => (
            <div
              onClick={() => setColor(color)}
              style={{
                backgroundColor: color,
                height: "30px",
                width: "30px",
                borderRadius: "100px",
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  const OriginalImage = () => {
    const [isReveal, setIsReveal] = useState(false);

    return (
      <div style={{ position: "absolute", bottom: "0px" }}>
        <button
          onClick={() => setIsReveal(true)}
          style={{
            backgroundColor: "#fff",
            color: "black", // text-white
            borderRadius: "0.5rem", // rounded-lg
            padding: "0.5rem 1.5rem", // px-6 py-2
          }}
        >
          Reveal
        </button>
        {isReveal && image && (
          <img
            src={image}
            style={{
              height: "120px",
              marginBottom: "-16px",
              marginLeft: "10px",
              borderRadius: "15px",
            }}
          />
        )}
      </div>
    );
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100vw" }}>
      {generationDone && objectBrushSets !== null && hexColors !== null && (
        <>
          <ReactP5Wrapper
            sketch={sketch}
            objectBrushSets={objectBrushSets}
            hexColors={hexColors}
          />
          {/* <div style={{ display: "flex", flexDirection: "row" }}>
            <div>
              <BrushPanel objectBrushSets={objectBrushSets} />
              <ColorPanel hexColors={hexColors} />
            </div> */}
          <OriginalImage />
          {/* </div> */}
        </>
      )}
      {!generationDone && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            // for dark:bg-gray-900, you'll need to add a conditional style based on a dark mode state
          }}
        >
          <div
            class="prompt-container"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem", // space-y-4 (approximate conversion)
            }}
          >
            <input
              type="text"
              id="prompt-input"
              placeholder="Hey! What do you want to paint?"
              onChange={(e) => setPrompt(e.target.value)}
              style={{
                border: "1px solid #d1d5db", // border and border-gray-300
                borderRadius: "2rem", // rounded-md
                padding: "1rem", // p-2
                fontSize: "1.6rem",
                width: "30rem", // w-80
                backgroundColor: "#1f2937", // dark:bg-gray-800
                color: "#e5e7eb", // dark:text-gray-200
                // dark:border-gray-700 requires conditional styling
              }}
            />
            <button
              id="generate-button"
              onClick={handleGenerate}
              style={{
                fontSize: "2rem",
                backgroundImage:
                  "linear-gradient(to right, #a855f7, #ec4899, #ef4444)", // bg-gradient-to-r from-purple-400 via-pink-500 to-red-500
                color: "white", // text-white
                borderRadius: "0.5rem", // rounded-lg
                padding: "0.5rem 1.5rem", // px-6 py-2
              }}
            >
              Go
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
