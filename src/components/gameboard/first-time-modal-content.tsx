import { ReactNode, useEffect, useState } from "react";
import { black, green } from "../../util/getColor";
import Button from "../Button/Button";
import Divider from "../Divider/Divider";
import WordleBox from "../wordle-box/wordle-box";

function Explainer({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {children}
      <span style={{ marginLeft: 4 }}>{label}</span>
    </div>
  );
}

function FirstTimeModalContent({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [timer, setTimer] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTimer((p) => !p), 1600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div style={{ fontSize: 20 }}>How to play {step + 1} / 2</div>
      <Divider />
      {step == 0 && (
        <>
          <div>
            <Explainer label="Correct Letter">
              <WordleBox miniBoard status="green" selected letter="A" inline />
            </Explainer>
            <Explainer label="Correct Letter But Wrong Spot">
              <WordleBox miniBoard status="yellow" letter="B" />
            </Explainer>
            <Explainer label="Wrong Letter">
              <WordleBox miniBoard status="wrong" letter="E" />
            </Explainer>
            <Explainer label="Locked In Letter">
              <WordleBox miniBoard status="locked" letter="F" />
            </Explainer>
            <Explainer label="Selected Letter">
              <WordleBox miniBoard status="selected" letter="C" />
            </Explainer>
            <Explainer label="Selected Empty Box">
              <WordleBox miniBoard status="selected" letter="" />
            </Explainer>
            <p>If the word is BIRDS and you guess BRIDE</p>
            <p>This is how your guesses would be labeled</p>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <WordleBox miniBoard status={"green"} letter="B" />
              <WordleBox miniBoard status={"yellow"} letter="R" />
              <WordleBox miniBoard status={"yellow"} letter="I" />
              <WordleBox miniBoard status={"green"} letter="D" />
              <WordleBox miniBoard status={"wrong"} letter="E" />
            </div>
          </div>
        </>
      )}
      {step === 1 && (
        <div>
          <p>Selection Behavior</p>
          <p>You can also select empty spaces or letters</p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <WordleBox
              miniBoard
              status={timer ? "selected" : "none"}
              hasPriority={timer}
              selected
              letter=""
            />
            <WordleBox
              miniBoard
              status="selected"
              hasPriority={!timer}
              letter="l"
            />
            <WordleBox miniBoard status="none" letter="" />
            <WordleBox miniBoard status="none" letter="" />
            <WordleBox miniBoard status="none" letter="" />
          </div>
          <p>
            If you double select a letter you can lock it in so you can type
            freely
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <WordleBox miniBoard status="pending" selected letter="N" />
            <WordleBox miniBoard status="pending" letter="E" />
            <WordleBox
              miniBoard
              hasPriority={timer}
              status={timer ? "selected" : "locked"}
              letter="A"
            />
            <WordleBox miniBoard status="pending" letter="T" />
            <WordleBox miniBoard status="none" letter="" />
          </div>
          <p>
            To make typing easier based on interactions a box will be
            highlighted on what the next box a letter will go into
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <WordleBox miniBoard status="none" letter="" />
            <WordleBox
              miniBoard
              status={timer ? "selected" : "none"}
              hasPriority={timer}
              selected
              letter={timer ? "W" : "E"}
            />
            <WordleBox
              miniBoard
              hasPriority={!timer}
              status="selected"
              letter="o"
            />
            <WordleBox miniBoard status="pending" letter="w" />
            <WordleBox miniBoard status={"none"} letter="" />
          </div>
        </div>
      )}
      <Divider />
      <div style={{ display: "flex" }}>
        {step === 0 ? (
          <Button
            onClick={() => onComplete()}
            backgroundColor={black}
            condensed
            fullWidth
            style={{ marginRight: 4 }}
          >
            Skip
          </Button>
        ) : (
          <Button
            onClick={() => setStep((p) => p - 1)}
            backgroundColor={black}
            condensed
            fullWidth
            style={{ marginRight: 4 }}
          >
            Back
          </Button>
        )}
        {step !== 1 ? (
          <Button
            onClick={() => setStep((p) => p + 1)}
            backgroundColor={green}
            condensed
            fullWidth
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={() => onComplete()}
            backgroundColor={green}
            condensed
            fullWidth
          >
            Complete
          </Button>
        )}
      </div>
    </div>
  );
}

export default FirstTimeModalContent;
