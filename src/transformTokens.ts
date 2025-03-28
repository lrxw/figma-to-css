type Document = DesignTokens[];

type DesignTokens = {
	"Design Tokens": {
		modes: {
			"Mode 1": Mode;
		};
	};
};

type Mode = {
	Font: Record<string, Definition>;
	Padding: Record<string, Definition>;
	Spacer: Record<string, Definition>;
	Form: Record<string, Definition>;
	Colors: Record<string, Record<string, Definition>>;
};

type ModeKey = keyof Mode;
type ModeKeyWithoutColors = Exclude<ModeKey, "Colors">;

type Definition = {
	$scopes: string[];
	$type: string;
	$value: string;
};

export const transformTokens = (tokens: Document): Record<string, string> => {
	const designTokens = tokens[0];
	const mode = designTokens["Design Tokens"].modes["Mode 1"];

	const colors = mode.Colors;
	let result: Record<string, string> = {};
	for (const [subKey, subValue] of Object.entries(colors)) {
		result = { ...result, ...transformDefinitions(subValue) };
	}

	for (const key in mode) {
		if (key === "Colors") continue;
		const definitions = mode[key as ModeKeyWithoutColors];
		result = { ...result, ...transformDefinitions(definitions) };
	}

	console.log(result);

	return result;
};

const transformDefinitions = (
	definitions: Record<string, Definition>,
): Record<string, string> => {
	let result: Record<string, string> = {};
	for (const [key, definition] of Object.entries(definitions)) {
		result = { ...result, ...transformDefinition(key, definition) };
	}
	return result;
};

const transformDefinition = (
	key: string,
	definition: Definition,
): Record<string, string> => {
	const variableName = key.toLowerCase().replaceAll(" ", "-");
	return { [variableName]: transformValue(definition.$value) };
};

const transformValue = (value: string): string => {
	console.log(value);
	if (Number.isNaN(Number(value))) {
		return value;
	}
	return `${value}px`;
};
