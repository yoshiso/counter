/// <reference path="../rx/rx.all.d.ts"/>
/// <reference path="../virtual-dom/virtual-dom.d.ts"/>

/**
 * Typescript definitions for cyclejs
 * Due to the dynamic and de-centralized nature of cycle, using these definitions takes a certain amount of disipline.
 * Firstly, you need to define and export three interfaces which you will use throughout your application.  You need
 * to extend all the drivers you are using in your application.  The examples below just use the DOM driver.
 *
 * export interface In extends DOMDriverIn {} // This is the input to the application
 * export interface CEIn<P> extends DOMDriverIn, PropsDriver<P> {} // This is the input to custom elements
 * export interface Out extends DOMDriverOut {} // This is the output of the application
 *
 * Then run the application using:
 *
 * function main(drivers: In): Out { ... }
 * Cycle.run<In, Out>(main, {
 * 	 DOM: makeDOMDriver(...)
 * });
 *
 * Custom components use the CEIn interface, parameterized over the properties.
 *
 * interface UserWidgetProps {
 *   name: string
 *   age: number
 * }
 * function userWidget(ext: CEIn<UserWidgetProps>):Out {
 * 	 ext.props.getAll().map({ name, age } => {
 *     ... typesafe properties!
 *   });
 * }
 *
 * Since there is no way to link the name of a customElement to its function, if you want typesafe hyperscript you
 * need to explicitly specify the properties as a type parameter.
 *
 * h<UserWidgetProps>('user-widget', { ... });
 */

declare module "@cycle/dom" {
	export interface VTree {}

	export interface DOMDriverIn {
		DOM: DOMDriver
	}

	type Elementselector = (selector: string) => ({observable: Rx.Observable<Element>, events: EventSelector})
	type EventSelector = (eventName: string, useCapture?: boolean) => Rx.Observable<CustomEvent>
	export interface DOMDriver {
		select: Elementselector
		dispose: () => void
	}

	export interface DOMDriverOut {
		DOM: Rx.Observable<VTree>
	}

	export interface PropsDriver<P> {
		props: {
			get: <T>(property: string) => Rx.Observable<T>
			getAll: () => Rx.Observable<P>
		}
	}

	interface DOMDriverFunction {
		(vtree$: Rx.Observable<any>, driverName: string): DOMDriver
	}
	export function makeDOMDriver(container: string | Element, customElements?: any): DOMDriverFunction;


	interface HTMLDriverFunctionResult extends Rx.Observable<string> {
		select: () => Rx.Observable<any>
	}
	interface HTMLDriverFunction {
		(vtree$: Rx.Observable<any>, driverName: string): HTMLDriverFunctionResult
	}
	export function makeHTMLDriver(customElementDefinitions?: any): HTMLDriverFunction;


	export function h<P>(selector: any, text: string): VTree;
	export function h<P>(selector: any, children?: VTree[]): VTree;
	export function h<P>(selector: any, props: P, text?: string): VTree;
	export function h<P>(selector: any, props: P, children?: VTree[]): VTree;

	export function svg<P>(selector: any, text: string): VTree;
	export function svg<P>(selector: any, children?: VTree[]): VTree;
	export function svg<P>(selector: any, props: P, text?: string): VTree;
	export function svg<P>(selector: any, props: P, children?: VTree[]): VTree;

	export function mockDOMResponse(mockedSelectors: any): Elementselector;


}
