import { Machine, interpret } from '@xstate/compiled';
import { ExampleModel } from './models/example.model';

type Data = {
  yeah: boolean;
};

interface Context {
  data: Data;
  example?: ExampleModel;
}
const initialContext: Context = {
  data: { yeah: false },
  example: new ExampleModel(),
};

type Event =
  | { type: 'MAKE_FETCH'; params: { id: string } }
  | { type: 'CANCEL' }
  | { type: 'done.invoke.makeFetch'; data: Data };

const machine = Machine<Context, Event, 'fetchMachine'>({
  initial: 'idle',
  states: {
    idle: {
      on: {
        MAKE_FETCH: 'pending',
      },
    },
    pending: {
      invoke: {
        src: 'makeFetch',
        onDone: 'success',
      },
    },
    success: {
      entry: ['celebrate'],
    },
  },
});

interpret(machine, {
  services: {
    makeFetch: () => {
      return Promise.resolve({
        yeah: true,
      });
    },
  },
  actions: {
    celebrate: (context, event) => {
      console.log(event.data);
    },
  },
});
