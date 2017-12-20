(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
let MainGrid = require('./maingrid');

let { render } = ReactDOM;

render(React.createElement(MainGrid, null), document.getElementById('root'));

},{"./maingrid":2}],2:[function(require,module,exports){
function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let SourceForm = require('./sourceform'),
    SchemaList = require('./schemalist'),
    TableForm = require('./tableform');

let { entries } = Object,
    { get } = axios,
    { Component } = React,
    { Dropdown, Grid, Icon, Menu } = semanticUIReact;

module.exports = class extends Component {

  constructor(props) {
    var _this;

    _this = super(props);

    this.onSourcesOpen = _asyncToGenerator(function* () {
      let { data } = yield get('/api/sources');
      _this.setState({ sources: data });
    });

    this.onNewSourceClick = () => {
      this.setState({
        current: {
          source: {
            name: '', host: '',
            user: '', pass: ''
          }
        }
      });
    };

    this.onSourceClick = (ev, { text }) => {
      this.setState(prev => {
        let source = prev.sources[text];
        source.name = text;
        return { current: { source } };
      });
    };

    this.onConnectClick = _asyncToGenerator(function* () {
      let { data } = yield get(`/api/schemas/${_this.state.current.source.name}`);
      _this.setState({ current: { schema: data } });
    });

    this.onTableTitleClick = (ev, name) => {
      this.setState(prev => {
        let { schema } = prev.current,
            table = schema[name];
        table.name = name;
        return { current: { schema, table } };
      });
    };

    this.state = {
      sources: {},
      current: {
        source: null,
        schema: null,
        table: null
      }
    };
  }

  render() {
    let { state } = this,
        { current } = state;

    return React.createElement(
      'div',
      null,
      React.createElement(
        Menu,
        { inverted: true, className: 'fixed' },
        React.createElement(Menu.Item, { name: 'Prequel' }),
        React.createElement(
          Dropdown,
          { item: true, trigger: React.createElement(
              'span',
              null,
              React.createElement(Icon, { name: 'database' }),
              'Sources'
            ), onOpen: this.onSourcesOpen },
          React.createElement(
            Dropdown.Menu,
            null,
            React.createElement(Dropdown.Item, { text: 'New Source', icon: 'add circle', onClick: this.onNewSourceClick }),
            React.createElement(Dropdown.Divider, null),
            entries(state.sources).map(([name]) => React.createElement(Dropdown.Item, { key: name, text: name, icon: '', onClick: this.onSourceClick }))
          )
        )
      ),
      React.createElement(
        Grid,
        { padded: true },
        React.createElement(
          Grid.Row,
          null,
          React.createElement(
            Grid.Column,
            null,
            React.createElement(
              Grid,
              null,
              React.createElement(
                Grid.Row,
                null,
                React.createElement(
                  Grid.Column,
                  { width: 3 },
                  current.schema && React.createElement(SchemaList, { schema: current.schema, onTableTitleClick: this.onTableTitleClick })
                ),
                React.createElement(
                  Grid.Column,
                  { width: 13 },
                  current.source && React.createElement(SourceForm, { source: current.source, onConnectClick: this.onConnectClick }),
                  current.table && React.createElement(TableForm, { table: current.table })
                )
              )
            )
          )
        )
      )
    );
  }

};

},{"./schemalist":3,"./sourceform":4,"./tableform":5}],3:[function(require,module,exports){
let TableList = require('./tablelist');

let { entries } = Object,
    { Component } = React,
    { Accordion, Icon } = semanticUIReact;

module.exports = class extends Component {

  constructor(props) {
    super(props);

    this.onTitleClick = ev => {
      // cancel expand / collapse behavior for title clicks
      ev.stopPropagation();
    };

    this.onTableTitleClick = (name, ev) => {
      // cancel expand / collapse behavior for title clicks
      ev.stopPropagation();
      this.props.onTableTitleClick(ev, name);
    };
  }

  render() {
    return React.createElement(Accordion, { exclusive: false, defaultActiveIndex: [0], panels: [{
        title: React.createElement(
          Accordion.Title,
          { key: `tables-title` },
          React.createElement(Icon, { name: 'dropdown' }),
          React.createElement(
            'span',
            { onClick: this.onTitleClick },
            'Tables'
          )
        ),
        content: {
          key: 'tables',
          content: React.createElement(Accordion.Accordion, { exclusive: false, panels: entries(this.props.schema).map(([name, table]) => ({
              title: React.createElement(
                Accordion.Title,
                { key: `table-${name}-title` },
                React.createElement(Icon, { name: 'dropdown' }),
                React.createElement(Icon, { name: 'table' }),
                React.createElement(
                  'span',
                  { onClick: this.onTableTitleClick.bind(this, name) },
                  name
                )
              ),
              content: {
                key: `table-${name}-content`,
                content: React.createElement(TableList, { table: table })
              }
            })) })
        }
      }] });
  }

};

},{"./tablelist":6}],4:[function(require,module,exports){
let { post } = axios,
    { Component } = React,
    { Form, Icon } = semanticUIReact;

module.exports = class extends Component {

  constructor(props) {
    super(props);

    this.onChange = (ev, { name, value }) => {
      this.setState({ [name]: value });
    };

    this.onSaveClick = () => {
      post('/api/sources', this.state);
    };

    this.state = props.source;
  }

  componentWillReceiveProps(props) {
    this.setState(props.source);
  }

  render() {
    let { state } = this;

    return React.createElement(
      Form,
      { size: "small" },
      React.createElement(Form.Input, { name: "name", label: "Name", placeholder: "Friendly name", width: 6, value: state.name, onChange: this.onChange }),
      React.createElement(Form.Input, { name: "host", label: "Host", placeholder: "Server hostname", width: 6, value: state.host, onChange: this.onChange }),
      React.createElement(Form.Input, { name: "user", label: "User", placeholder: "Your username", width: 6, value: state.user, onChange: this.onChange }),
      React.createElement(Form.Input, { type: "password", name: "pass", label: "Pass", placeholder: "Your password", width: 6, value: state.pass, onChange: this.onChange }),
      React.createElement(
        Form.Group,
        null,
        React.createElement(
          Form.Button,
          { onClick: this.onSaveClick },
          React.createElement(Icon, { name: "save" }),
          "Save"
        ),
        React.createElement(
          Form.Button,
          { onClick: this.props.onConnectClick },
          "Connect",
          React.createElement(Icon, { name: "arrow circle right" })
        )
      )
    );
  }

};

},{}],5:[function(require,module,exports){
function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let { entries } = Object,
    { post } = axios,
    { Component } = React,
    { Form, Icon, Table } = semanticUIReact;

module.exports = class extends Component {

  constructor(props) {
    var _this;

    _this = super(props);

    this.onChange = (ev, { name, value, checked }) => {
      let [prop, col] = name.split(':', 2);

      // TODO: no renaming columns yet
      if (prop === 'name') return;

      switch (value) {
        case undefined:
          value = +checked;
          break;
        case '!@#NONE#@!':
          value = null;
          break;
      }

      let column = this.props.table.columns[col];
      column[prop] = value;
      this.setState({ [col]: column });
    };

    this.onSaveClick = _asyncToGenerator(function* () {
      let { status } = yield post(`/api/tables/${_this.props.table.name}/columns`, _this.state);
      if (status == 200) {
        let next = {};
        for (let col in _this.state) {
          next[col] = undefined;
        }
        _this.setState(next);
      }
    });
    this.state = {};
  }

  render() {
    return React.createElement(
      Form,
      { size: "small" },
      React.createElement(
        Table,
        { celled: true, selectable: true, striped: true },
        React.createElement(
          Table.Header,
          null,
          React.createElement(
            Table.Row,
            null,
            React.createElement(
              Table.HeaderCell,
              null,
              "Name"
            ),
            React.createElement(
              Table.HeaderCell,
              null,
              "Type"
            ),
            React.createElement(
              Table.HeaderCell,
              { textAlign: "center" },
              "Null?"
            ),
            React.createElement(
              Table.HeaderCell,
              null,
              "Default"
            )
          )
        ),
        React.createElement(
          Table.Body,
          null,
          entries(this.props.table.columns).map(([name, { type, nullable, defvalue }]) => React.createElement(
            Table.Row,
            { key: name },
            React.createElement(
              Table.Cell,
              null,
              React.createElement(Form.Input, { name: `name:${name}`, value: name })
            ),
            React.createElement(
              Table.Cell,
              null,
              React.createElement(Form.Select, { name: `type:${name}`, value: type,
                options: ['int', 'decimal', 'varchar'].map(type => ({ text: type, value: type })), onChange: this.onChange })
            ),
            React.createElement(
              Table.Cell,
              { textAlign: "center" },
              React.createElement(Form.Checkbox, { name: `nullable:${name}`, checked: nullable != 0, onChange: this.onChange })
            ),
            React.createElement(
              Table.Cell,
              null,
              React.createElement(Form.Dropdown, { name: `defvalue:${name}`, search: true, selection: true, allowAdditions: true, text: defvalue, value: defvalue == null ? '!@#NONE#@!' : defvalue,
                options: [
                // HACK: use magic value for null since null itself cannot be used in the dropdown options
                { text: 'none', value: '!@#NONE#@!' }], onChange: this.onChange })
            )
          ))
        )
      ),
      React.createElement(
        Form.Group,
        null,
        React.createElement(
          Form.Button,
          { onClick: this.onSaveClick },
          React.createElement(Icon, { name: "save" }),
          "Save"
        )
      )
    );
  }

};

},{}],6:[function(require,module,exports){
let { entries } = Object,
    { Component } = React,
    { Accordion, Icon, List } = semanticUIReact;

module.exports = class extends Component {
  constructor(...args) {
    var _temp;

    return _temp = super(...args), this.onTitleClick = ev => {
      // cancel expand / collapse behavior for title clicks
      ev.stopPropagation();
    }, _temp;
  }

  render() {
    let { table } = this.props;

    return React.createElement(Accordion.Accordion, { exclusive: false, defaultActiveIndex: [0], panels: [{
        title: React.createElement(
          Accordion.Title,
          { key: `columns-title` },
          React.createElement(Icon, { name: "dropdown" }),
          React.createElement(
            "span",
            { onClick: this.onTitleClick },
            "Columns"
          )
        ),
        content: {
          key: 'columns',
          content: React.createElement(
            List,
            null,
            entries(table.columns).map(([name]) => React.createElement(
              List.Item,
              { key: `column-${name}-content` },
              React.createElement(List.Icon, { name: "columns" }),
              React.createElement(
                List.Content,
                null,
                React.createElement(
                  List.Header,
                  null,
                  name
                )
              )
            ))
          )
        }
      }, {
        title: React.createElement(
          Accordion.Title,
          { key: `keys-title` },
          React.createElement(Icon, { name: "dropdown" }),
          React.createElement(
            "span",
            { onClick: this.onTitleClick },
            "Keys"
          )
        ),
        content: {
          key: 'keys',
          content: React.createElement(
            List,
            null,
            entries(table.keys).map(([name]) => React.createElement(
              List.Item,
              { key: `key-${name}-content` },
              React.createElement(List.Icon, { name: "key" }),
              React.createElement(
                List.Content,
                null,
                React.createElement(
                  List.Header,
                  null,
                  name
                )
              )
            ))
          )
        }
      }] });
  }

};

},{}]},{},[1]);
