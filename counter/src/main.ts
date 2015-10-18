///<reference path="../typings/cycle/core.d.ts"/>
///<reference path="../typings/cycle/dom.d.ts"/>


import {run, Rx} from '@cycle/core';
import {h, makeDOMDriver, DOMDriverIn, DOMDriverOut, DOMDriver} from '@cycle/dom';

function main(responses: DOMDriverIn) : DOMDriverOut {
  let DOM = responses.DOM;
  let action$ = Rx.Observable.merge(
    DOM.select('.decrement').events('click').map((ev: CustomEvent) => -1),
    DOM.select('.increment').events('click').map((ev: CustomEvent) => 1)
  );

  let count$ = action$.startWith(0).scan((x: number, y: number) => x + y);
  return {
    DOM: count$.map((count: number) =>
      h('div', [
        h('button.decrement', 'Decrement'),
        h('button.increment', 'Increment'),
        h('p', `Counter: ${count}`)
      ])
    )
  };
}

run(main, {
  DOM: makeDOMDriver('#main-container')
})
