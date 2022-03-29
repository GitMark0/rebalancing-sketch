let canvasWidth;
let canvasHeight;

let marginX;
let marginY;

// Buttons and inputs
let resetButton;
let bridgeActionInput = 0;

// Liquidity pool dimensions
let liquidityPoolWidth;
let liquidityPoolHeight;
const roundFactor = 10;

let liquidityPoolX;
let liquidityPoolY;
let unscaledEquilibriumLiquidity;
let unscaledLiquidityPoolBalance;
let unscaledIncentivePoolBalance;
let equilibriumLiquidity = 50;
let liquidityPoolBalance = 50;

// Incentive pool
let incentivePoolWidth;
let incentivePoolHeight;

let incentivePoolX;
let incentivePoolY;

let incentivePoolBalance;
let incentivePoolReward;

// Sliders
let maxPunishmentSlider;
let equilibriumLiquiditySlider;
let poolLiquiditySlider;
let incentivePoolLiquiditySlider;

let sliderY;
let sliderX;

let coinTypeFeeRadio;
let bridgeActionRadio;
let coinTypeFeeDiv;
let bridgeActionRadioDiv;

let displayText = "THIS MESSAGE WILL BE REPLACED AS YOU UPDATE PARAMS...";

function setup() {
  canvasWidth = displayWidth;
  canvasHeight = displayHeight;

  marginX = canvasWidth / 6;
  marginY = canvasHeight / 6;

  liquidityPoolWidth = canvasWidth / 15;
  liquidityPoolHeight = canvasHeight / 7;

  incentivePoolWidth = canvasWidth / 30;
  incentivePoolHeight = canvasHeight / 14;

  unscaledEquilibriumLiquidity = liquidityPoolHeight / 2;
  unscaledLiquidityPoolBalance = unscaledEquilibriumLiquidity;
  unscaledIncentivePoolBalance = 0;
  incentivePoolBalance = 0;
  incentivePoolReward = 0;

  liquidityPoolX = canvasWidth / 2 - 3 * liquidityPoolWidth - marginX;
  liquidityPoolY = canvasHeight / 2 - liquidityPoolHeight - marginY;

  incentivePoolX =
    canvasWidth / 2 - 3 * incentivePoolWidth - marginX + incentivePoolWidth * 4;
  incentivePoolY = canvasHeight / 2 - incentivePoolHeight - marginY;

  sliderY = liquidityPoolY + liquidityPoolHeight * 1.75;
  sliderX = liquidityPoolX;

  createCanvas(canvasWidth, canvasHeight);

  bridgeActionRadioDiv = document.createElement("div");
  bridgeActionRadioDiv.style.position = "absolute";
  bridgeActionRadioDiv.style.top = `${sliderY + canvasHeight / 4}px`;
  bridgeActionRadioDiv.style.left = `${sliderX}px`;
  bridgeActionRadioDiv.style.margin = "0px";

  bridgeActionRadio = createRadio(bridgeActionRadioDiv);
  bridgeActionRadio.option("1", "Deposit to bridge");
  bridgeActionRadio.option("2", "Withdraw from bridge");
  bridgeActionRadio.style("font-size", "18px");
  bridgeActionRadio.selected("2");
  bridgeActionRadio.attribute("name", "first");
  bridgeActionRadio.changed(displayBridgingResult);

  bridgeActionInput = drawInput(
    sliderX + textSize() * 5,
    sliderY + canvasHeight / 4 + textSize() * 4,
    100,
    displayBridgingResult
  );

  resetButton = drawButton("Reset", sliderX, sliderY + canvasHeight / 3, reset);

  maxPunishmentSlider = drawSlider(
    0,
    100,
    50,
    sliderX + liquidityPoolWidth * 1.8 * 3,
    sliderY,
    null,
    displayBridgingResult
  );

  equilibriumLiquiditySlider = drawSlider(
    0,
    100,
    50,
    sliderX + liquidityPoolWidth * 1.8 * 2,
    sliderY,

    setEquilibriumLiquidity,
    displayBridgingResult
  );

  poolLiquiditySlider = drawSlider(
    0,
    100,
    50,
    sliderX + liquidityPoolWidth * 1.8,
    sliderY,
    setPoolLiquidity,
    displayBridgingResult
  );

  incentivePoolLiquiditySlider = drawSlider(
    0,
    100,
    0,
    sliderX,
    sliderY,
    setIncentivePoolLiquidity,
    displayBridgingResult
  );

  coinTypeFeeDiv = document.createElement("div");
  coinTypeFeeDiv.style.position = "absolute";
  coinTypeFeeDiv.style.top = `${sliderY + canvasHeight / 7}px`;
  coinTypeFeeDiv.style.left = `${sliderX}px`;
  coinTypeFeeDiv.style.margin = "0px";

  coinTypeFeeRadio = createRadio(coinTypeFeeDiv);
  coinTypeFeeRadio.option("1", "Stable coin");
  coinTypeFeeRadio.option("2", "Non-stable coin");
  coinTypeFeeRadio.style("font-size", "18px");
  coinTypeFeeRadio.selected("2");
  coinTypeFeeRadio.attribute("name", "second");
  coinTypeFeeRadio.changed(displayBridgingResult);
}

function draw() {
  background(255, 255, 255);
  drawLiquidityPool(
    liquidityPoolX,
    liquidityPoolY,
    unscaledEquilibriumLiquidity,
    unscaledLiquidityPoolBalance
  );
  drawInfoText(liquidityPoolX, liquidityPoolY, incentivePoolReward);
  drawIncentivePool(
    incentivePoolX,
    incentivePoolY,
    unscaledIncentivePoolBalance
  );
  textSize(liquidityPoolHeight / 5);
  text(displayText, canvasWidth / 10, 100);
  textSize(liquidityPoolHeight / 10);

  text("Amount:", sliderX, sliderY + canvasHeight / 4 + textSize() * 4);
}

function drawLine(color, x1, y1, x2, y2) {
  stroke(color);
  line(x1, y1, x2, y2);
  stroke("gray");
}

function drawLiquidityPool(
  x,
  y,
  unscaledEquilibriumLiquidity,
  unscaledLiquidityPoolBalance
) {
  rect(x, y, liquidityPoolWidth, liquidityPoolHeight, roundFactor);
  // Equilibrium liquidity line
  strokeWeight(4);
  drawLine(
    "red",
    x,
    y + unscaledEquilibriumLiquidity,
    x + liquidityPoolWidth,
    y + unscaledEquilibriumLiquidity
  );
  // Pool liquidity line
  drawLine(
    "blue",
    x,
    y + unscaledLiquidityPoolBalance,
    x + liquidityPoolWidth,
    y + unscaledLiquidityPoolBalance
  );
  strokeWeight(1);
}

function drawInfoText(x, y, reward) {
  textSize(liquidityPoolHeight / 10);
  const shiftX = liquidityPoolWidth * 1.3;
  const shiftY = textSize();

  text("Liquidity pool", x, y - textSize());
  textSize(liquidityPoolHeight / 10);
  text(
    ` Release fee: ${coinTypeFeeRadio.value() === "1" ? "0.15%" : "0.35%"}`,
    x + shiftX,
    y + (liquidityPoolHeight - shiftY)
  );
  text(
    ` Maximum punishment: ${
      !maxPunishmentSlider ? 0 : maxPunishmentSlider.value()
    }`,
    x + shiftX,
    y + (liquidityPoolHeight - 2 * shiftY)
  );
  stroke("red");
  text(
    ` Equilibrium liquidity: ${equilibriumLiquidity}`,
    x + shiftX,
    y + (liquidityPoolHeight - 3 * shiftY)
  );
  stroke("blue");
  text(
    ` Liquidity pool balance: ${liquidityPoolBalance}`,
    x + shiftX,
    y + (liquidityPoolHeight - 4 * shiftY)
  );
  stroke("gray");
  text(
    ` Reward / Punishment: ${((reward * incentivePoolHeight) / 100).toFixed(
      3
    )}`,
    x + shiftX,
    y + (liquidityPoolHeight - 5 * shiftY)
  );
  stroke("green");
  text(
    ` Incentive pool balance: ${incentivePoolBalance.toFixed(3)}`,
    x + shiftX,
    y + (liquidityPoolHeight - 6 * shiftY)
  );
  stroke("gray");
  textSize(liquidityPoolHeight / 8);
  text("Stats: ", x + shiftX, y + (liquidityPoolHeight - 7.5 * shiftY));

  textSize(liquidityPoolHeight / 7);
  text("1. Set Pool State", sliderX, sliderY - textSize());
  textSize(liquidityPoolHeight / 10);

  textSize(liquidityPoolHeight / 7);
  text("2. Pick Crypto Type", sliderX, sliderY + canvasHeight / 8 - textSize());
  textSize(liquidityPoolHeight / 10);

  textSize(liquidityPoolHeight / 7);
  text(
    "3. Input Amount and Pick Action",
    sliderX,
    sliderY + canvasHeight / 4 - textSize()
  );
  textSize(liquidityPoolHeight / 10);

  text(
    "Incentive pool balance",
    sliderX,
    sliderY + maxPunishmentSlider.height + 1.1 * textSize()
  );

  text(
    "Pool balance",
    sliderX + liquidityPoolWidth * 1.8,
    sliderY + maxPunishmentSlider.height + 1.1 * textSize()
  );

  text(
    "Equilibrium liquidity",
    sliderX + liquidityPoolWidth * 1.8 * 2,
    sliderY + maxPunishmentSlider.height + 1.1 * textSize()
  );

  text(
    "Maximum punishment",
    sliderX + liquidityPoolWidth * 1.8 * 3,
    sliderY + maxPunishmentSlider.height + 1.1 * textSize()
  );
}

// Draw functions

function drawIncentivePool(x, y, unscaledLiquidityPoolBalance) {
  textSize(liquidityPoolHeight / 10);
  text("Incentive pool", x, y - textSize());
  rect(x, y, incentivePoolWidth, incentivePoolHeight, roundFactor);
  strokeWeight(4);
  stroke("green");
  line(
    x,
    y - unscaledLiquidityPoolBalance + incentivePoolHeight,
    x + incentivePoolWidth,
    y - unscaledLiquidityPoolBalance + incentivePoolHeight
  );
  strokeWeight(1);
  stroke("gray");
}

function drawButton(text, x, y, handler) {
  const button = createButton(text);
  button.position(x, y);
  button.mousePressed(handler);

  return button;
}

function drawInput(x, y, size, handler) {
  const input = createInput("");
  input.position(x, y);
  input.size(size);
  input.input(handler);

  return input;
}

function drawSlider(
  minRange,
  maxRange,
  startingValue,
  x,
  y,
  handler,
  changeHandler
) {
  const slider = createSlider(minRange, maxRange, startingValue);
  slider.position(x, y);
  slider.style("width", "100px");

  if (handler) {
    slider.input(handler);
  }

  if (changeHandler) {
    slider.changed(changeHandler);
  }

  return slider;
}

// State modifiers

function addLiquidityERC20() {
  const newEquilibriumLiquidity =
    equilibriumLiquidity + Number(addLiquidityInputValue);
  const newliquidityPoolBalance =
    liquidityPoolBalance + Number(addLiquidityInputValue);

  if (newEquilibriumLiquidity <= 100 && newliquidityPoolBalance <= 100) {
    equilibriumLiquidity = newEquilibriumLiquidity;
    unscaledEquilibriumLiquidity -=
      (Number(addLiquidityInputValue) * liquidityPoolHeight) / 100;
    liquidityPoolBalance += Number(addLiquidityInputValue);
    unscaledLiquidityPoolBalance -=
      (Number(addLiquidityInputValue) * liquidityPoolHeight) / 100;
  }

  addLiquidityInput.value("");
}

function removeLiquidityERC20() {
  const newEquilibriumLiquidity =
    equilibriumLiquidity - Number(addLiquidityInputValue);
  const newliquidityPoolBalance =
    liquidityPoolBalance - Number(addLiquidityInputValue);

  if (newEquilibriumLiquidity >= 0 && newliquidityPoolBalance >= 0) {
    equilibriumLiquidity = newEquilibriumLiquidity;
    unscaledEquilibriumLiquidity +=
      (Number(addLiquidityInputValue) * liquidityPoolHeight) / 100;
    liquidityPoolBalance -= Number(addLiquidityInputValue);
    unscaledLiquidityPoolBalance +=
      (Number(addLiquidityInputValue) * liquidityPoolHeight) / 100;
  }

  removeLiquidityInput.value("");
}

function releaseERC20() {
  const newLiquidityPoolBalance =
    liquidityPoolBalance - Number(bridgeActionInput);
  if (newLiquidityPoolBalance < 0) {
    return;
  }

  const punishment = getPunishment(
    equilibriumLiquidity,
    liquidityPoolBalance,
    Number(bridgeActionInput)
  );

  incentivePoolReward = -punishment;
  unscaledIncentivePoolBalance += (punishment * incentivePoolHeight) / 100;
  incentivePoolBalance += punishment;
  liquidityPoolBalance = newLiquidityPoolBalance;
  unscaledLiquidityPoolBalance +=
    (Number(bridgeActionInput) * liquidityPoolHeight) / 100;

  releaseInput.value("");
}

function depositERC20() {
  const newLiquidityPoolBalance =
    liquidityPoolBalance + Number(bridgeActionInput);
  if (newLiquidityPoolBalance > 100) {
    return;
  }

  const reward = getReward(
    equilibriumLiquidity,
    liquidityPoolBalance,
    incentivePoolBalance,
    Number(bridgeActionInput)
  );

  incentivePoolReward = reward;
  incentivePoolBalance -= reward;
  unscaledIncentivePoolBalance -= (reward * incentivePoolHeight) / 100;
  liquidityPoolBalance = newLiquidityPoolBalance;
  unscaledLiquidityPoolBalance -=
    (Number(bridgeActionInput) * liquidityPoolHeight) / 100;

  depositInput.value("");
}

// UTILS

function getReward(
  unscaledEquilibriumLiquidity,
  liquidityPoolBalance,
  incentivePoolBalance,
  depositAmount
) {
  if (
    liquidityPoolBalance >= unscaledEquilibriumLiquidity ||
    incentivePoolBalance == 0
  ) {
    return 0;
  }

  const imbalanceGap = unscaledEquilibriumLiquidity - liquidityPoolBalance;

  if (imbalanceGap === 0) {
    return 0;
  }
  const reward = min(depositAmount / imbalanceGap, 1) * incentivePoolBalance;

  return reward;
}

function getPunishment(
  unscaledEquilibriumLiquidity,
  liquidityPoolBalance,
  withdrawAmount
) {
  const liquidityPoolBalanceAfterWithdrawal =
    liquidityPoolBalance - withdrawAmount;

  if (liquidityPoolBalanceAfterWithdrawal >= unscaledEquilibriumLiquidity) {
    return 0;
  }

  const maxPunishment = withdrawAmount * (maxPunishmentSlider.value() / 100);
  const punishment =
    maxPunishment *
    (1 - liquidityPoolBalanceAfterWithdrawal / unscaledEquilibriumLiquidity);

  return punishment;
}

function reset() {
  incentivePoolBalance = 0;
  incentivePoolReward = 0;
  equilibriumLiquidity = 50;
  liquidityPoolBalance = 50;

  unscaledEquilibriumLiquidity = liquidityPoolHeight / 2;
  unscaledLiquidityPoolBalance = unscaledEquilibriumLiquidity;
  unscaledIncentivePoolBalance = 0;

  maxPunishmentSlider.value(50);
  equilibriumLiquiditySlider.value(50);
  poolLiquiditySlider.value(50);
  incentivePoolLiquiditySlider.value(0);
}

// Setters

function setbridgeActionInput() {
  bridgeActionInput = this.value();
}

function setPoolLiquidity() {
  liquidityPoolBalance = this.value();
  unscaledLiquidityPoolBalance =
    liquidityPoolHeight - (liquidityPoolBalance * liquidityPoolHeight) / 100;
}

function setIncentivePoolLiquidity() {
  incentivePoolBalance = this.value();
  unscaledIncentivePoolBalance =
    (incentivePoolBalance * incentivePoolHeight) / 100;
  incentivePoolBalance = incentivePoolBalance;
}

function setEquilibriumLiquidity() {
  equilibriumLiquidity = this.value();
  unscaledEquilibriumLiquidity =
    liquidityPoolHeight - (equilibriumLiquidity * liquidityPoolHeight) / 100;
}

function displayBridgingResult() {
  const inputValue = Number(bridgeActionInput.value());
  const radioValue = bridgeActionRadio.value();
  const tokenFee = coinTypeFeeRadio.value() === "1" ? 0.15 : 0.35;

  switch (radioValue) {
    case "1":
      const reward = getReward(
        equilibriumLiquidity,
        liquidityPoolBalance,
        incentivePoolBalance,
        inputValue
      );
      displayText = `You will receive: ${reward} from incentive pool and will need to pay ${
        tokenFee * inputValue
      } bridging fees.\nIn total you will be left with: ${
        inputValue + reward - tokenFee * inputValue
      }`;

      break;
    case "2":
      const punishment = getPunishment(
        equilibriumLiquidity,
        liquidityPoolBalance,
        inputValue
      );
      displayText = `You will need to pay: ${punishment} to incentive pool and ${
        tokenFee * inputValue
      } bridging fees.\nIn total you will be left with: ${
        inputValue - punishment - tokenFee * inputValue
      }`;
      break;
    default:
      console.log("unknown");
  }
}
