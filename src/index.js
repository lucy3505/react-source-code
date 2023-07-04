import React from "react";
import ReactDOM from "react-dom";

let ColorTheme = React.createContext();
//context
///1 提供数据 provider
//在下层组件中获取数据

//1 static contextType=
//2ColorTheme.Consumer 他的值 是一个方法 这个方法的参数就是 提供的数据

console.log(ColorTheme);
class Page extends React.Component {
  constructor(props) {
    super(props);
    this.state = { color: "red" };
  }

  changeColor = (color) => {
    this.setState({ color });
  };

  //提供数据 =》Provider组件
  render() {
    let context = { changeColor: this.changeColor, color: this.state.color };
    return (
      <ColorTheme.Provider value={context}>
        <div
          style={{
            margin: "10px",
            padding: "10px",
            border: `10px solid ${this.state.color}`,
            width: "300px",
          }}
        >
          Page
          <Header></Header>
          <Main></Main>
        </div>
      </ColorTheme.Provider>
    );
  }
}

class Header extends React.Component {
  static contextType = ColorTheme; //context
  render() {
    return (
      <div
        style={{
          margin: "10px",
          padding: "10px",
          border: `10px solid ${this.context.color}`,
        }}
      >
        header
        <Title></Title>
      </div>
    );
  }
}

class Title extends React.Component {
  static contextType = ColorTheme; //context
  render() {
    return (
      <ColorTheme.Consumer>
        {(value) => (
          <div
            style={{
              margin: "10px",
              padding: "10px",
              border: `10px solid ${value.color}`,
            }}
          >
            title
          </div>
        )}
      </ColorTheme.Consumer>
    );
  }
}

class Main extends React.Component {
  static contextType = ColorTheme; //context
  render() {
    return (
      <div
        style={{
          margin: "10px",
          padding: "10px",
          border: `10px solid ${this.context.color}`,
        }}
      >
        Main
        <Content></Content>
      </div>
    );
  }
}

class Content extends React.Component {
  static contextType = ColorTheme; //context
  render() {
    return (
      <ColorTheme.Consumer>
        {(value) => (
          <div
            style={{
              margin: "10px",
              padding: "10px",
              border: `10px solid ${value.color}`,
            }}
          >
            Content
            <button onClick={() => value.changeColor("red")}>变红</button>
            <button onClick={() => value.changeColor("black")}>变黑</button>
          </div>
        )}
      </ColorTheme.Consumer>
    );
  }
}

ReactDOM.render(<Page name="1" />, document.getElementById("root"));
