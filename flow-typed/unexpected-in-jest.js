// @flow

// Overrides the 'expect' global to fit the signature of unexpected

declare type ExpectChain = {
	and(assertion: string, ...valuesOrAssertions: Array<*>): ExpectChain,
} & Promise<*>;

declare var expect: {
	(subject: *, assertion: string, ...valuesOrAssertions: Array<*>): ExpectChain,
	it(assertion: string, ...valuesOrAssertions: Array<*>): ExpectChain,
};
