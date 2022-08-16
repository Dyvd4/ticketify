import * as React from "react";
import Card from '../components/Card';

interface IndexProps { }

interface IndexState { }

class Index extends React.Component<IndexProps, IndexState> {
  render() {
    return <Card centered>
      Hello world
    </Card>
  }
}

export default Index;
