
const TestStuff = ({ vm }) => {
  return (
        <p>
          <button id="button" onclick={() => vm.$emit('hi', 'hi')}>hi</button>
          {vm.paramsMessage && <span>{vm.paramsMessage}</span>}
              <p>{(vm.id || vm.paramsMessage) &&
                <strong>
                  {vm.id && <span>Route params Id: {vm.id}.</span>}
                  {vm.paramsMessage &&
                  <span>Params message: {vm.paramsMessage}</span>}
                </strong>}</p>
              <button
                style="margin-right: auto"
                onclick={() => vm.$go('/test/3')}>
                test: 3
              </button>
              <p>
                <input type="text" oninput={(e) => vm.paramsMessage = e.target.value} />
                {vm.paramsMessage}
                <button
                  id="params-btn"
                  onclick={() => vm.navigate()}>
                  examples: {vm.paramsMessage}
                </button>
            </p>
        </p>
      )
}

export default TestStuff