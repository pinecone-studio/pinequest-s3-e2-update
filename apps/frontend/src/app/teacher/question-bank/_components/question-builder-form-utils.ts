"use client";

const MATH_FORMULA_HELPERS = [
  { label: "sin", value: "sin(x)" },
  { label: "cos", value: "cos(x)" },
  { label: "tan", value: "tan(x)" },
  { label: "log", value: "log(x)" },
  { label: "ln", value: "ln(x)" },
  { label: "frac", value: "a/b" },
  { label: "sqrt", value: "√()" },
  { label: "x^2", value: "x^2" },
  { label: "x_n", value: "x_n" },
  { label: "pi", value: "π" },
  { label: "theta", value: "θ" },
  { label: "lim", value: "lim x->a" },
  { label: "sum", value: "sum(i=1..n)" },
  { label: "int", value: "int(a..b)" },
];

const PHYSICS_FORMULA_HELPERS = [
  { label: "v = s/t", value: "v = s/t" },
  { label: "F = ma", value: "F = ma" },
  { label: "E = mc^2", value: "E = mc^2" },
  { label: "P = UI", value: "P = UI" },
  { label: "W = Fs", value: "W = Fs" },
  { label: "Q = It", value: "Q = It" },
  { label: "sqrt", value: "√()" },
  { label: "delta", value: "Δx" },
  { label: "lambda", value: "λ" },
  { label: "rho", value: "ρ" },
  { label: "theta", value: "θ" },
  { label: "mu", value: "μ" },
  { label: "omega", value: "ω" },
  { label: "pi", value: "π" },
];

const CHEMISTRY_FORMULA_HELPERS = [
  { label: "H2O", value: "H2O" },
  { label: "CO2", value: "CO2" },
  { label: "O2", value: "O2" },
  { label: "NaCl", value: "NaCl" },
  { label: "H+", value: "H+" },
  { label: "OH-", value: "OH-" },
  { label: "pH", value: "pH" },
  { label: "n = m/M", value: "n = m/M" },
  { label: "c = n/V", value: "c = n/V" },
  { label: "mol", value: "mol" },
  { label: "->", value: "→" },
  { label: "<->", value: "⇌" },
];

const GENERIC_FORMULA_HELPERS = [
  { label: "frac", value: "a/b" },
  { label: "sqrt", value: "√()" },
  { label: "x^2", value: "x^2" },
  { label: "x_n", value: "x_n" },
  { label: "pi", value: "π" },
];

export function getFormulaHelpers(subject: string) {
  const normalized = subject.trim().toLowerCase();

  if (normalized.includes("мат") || normalized.includes("math")) {
    return MATH_FORMULA_HELPERS;
  }

  if (normalized.includes("физ") || normalized.includes("phys")) {
    return PHYSICS_FORMULA_HELPERS;
  }

  if (normalized.includes("хими") || normalized.includes("chem")) {
    return CHEMISTRY_FORMULA_HELPERS;
  }

  return GENERIC_FORMULA_HELPERS;
}

export function subjectSupportsFormula(subject: string) {
  const normalized = subject.trim().toLowerCase();

  return (
    normalized.includes("мат")
    || normalized.includes("math")
    || normalized.includes("физ")
    || normalized.includes("phys")
    || normalized.includes("хими")
    || normalized.includes("chem")
  );
}
