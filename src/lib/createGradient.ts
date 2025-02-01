interface GradientOptions {
  breakpoints?: ("sm" | "md" | "lg" | "xl" | "2xl")[];
  states?: ("hover" | "focus" | "active" | "group-hover")[];
  transitions?: boolean;
}

const createLinearGradient = (
  direction: string = "to-r",
  options?: GradientOptions,
  colors: string[] = []
): string => {
  const PRESET_GRADIENTS = [
    ["purple-400", "pink-400"],
    ["blue-400", "cyan-400"],
    ["green-400", "emerald-400"],
    ["rose-400", "amber-400"],
    ["fuchsia-400", "violet-400"],
    ["sky-400", "indigo-400"],
    ["teal-400", "lime-400"],
    ["orange-400", "red-400"],
    ["violet-400", "purple-400"],
    ["cyan-400", "blue-600"],
    ["lime-400", "green-600"],
    ["amber-400", "orange-600"],
  ];

  const VALID_DIRECTIONS = [
    "to-r",
    "to-l",
    "to-t",
    "to-b",
    "to-tr",
    "to-tl",
    "to-br",
    "to-bl",
  ];
  if (!VALID_DIRECTIONS.includes(direction)) {
    throw new Error(
      `Invalid direction "${direction}". Use: ${VALID_DIRECTIONS.join(", ")}`
    );
  }

  if (colors.length === 0) {
    colors =
      PRESET_GRADIENTS[Math.floor(Math.random() * PRESET_GRADIENTS.length)];
  }

  if (colors.length < 2) {
    throw new Error("At least two color stops are required");
  }

  const baseClass = `bg-gradient-${direction}`;

  const responsiveClasses =
    options?.breakpoints
      ?.map((b) => `${b}:bg-gradient-${direction}`)
      .join(" ") || "";
  const stateClasses =
    options?.states?.map((s) => `${s}:bg-gradient-${direction}`).join(" ") ||
    "";

  const colorStopUtils = colors
    .map((color, index) => {
      const isCustomColor = color.includes("#") || color.startsWith("rgb");
      const position =
        index === 0 ? "from" : index === colors.length - 1 ? "to" : "via";

      return isCustomColor
        ? `${position}-[${color}]`
        : color.match(/^(from-|to-|via-)/)
        ? color
        : `${position}-${color}`;
    })
    .join(" ");

  const transitionClasses = options?.transitions
    ? "transition-all duration-300 ease-in-out"
    : "";

  return [
    baseClass,
    responsiveClasses,
    stateClasses,
    colorStopUtils,
    transitionClasses,
  ]
    .filter(Boolean)
    .join(" ");
};

export default createLinearGradient;
