import { faCss3, faNodeJs, faReact } from '@fortawesome/free-brands-svg-icons';
import { faDatabase, faServer } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from "react";
import DarkModeButton from '../components/Buttons/DarkMode';
import Card from '../components/Card';
import Icon from '../components/Icons/Icon';
import ToolTip from '../components/ToolTip';
import TypedText from '../components/TypedText';

interface IndexProps { }

interface IndexState { }

class Index extends React.Component<IndexProps, IndexState> {
  render() {
    return <Card centered>
      <span className="float-right">
        <ToolTip title="Toggle dark mode">
          <DarkModeButton type="rounded" />
        </ToolTip>
      </span>
      <h1>
        <span className="mr-2">
          <TypedText>
            Hello world
          </TypedText>
        </span>
        <FontAwesomeIcon className="animate-spin" icon={faReact} size="1x" />
      </h1>
      <p>
        Template app created with
      </p>
      <ul>
        <li>Mongo DB</li>
        <li>Express</li>
        <li>React</li>
        <li>Node JS</li>
        <li>Tailwind CSS</li>
      </ul>
      <p>Backend and Frontend are written in <b>Typescript</b></p>
      <div className="flex justify-center items-center gap-4">
        <Icon
          onClick={(e) => console.log(e)}
          type="rounded"
          size="2x"
          icon={faDatabase} />
        <Icon
          type="rounded"
          size="2x"
          icon={faServer} />
        <Icon
          type="rounded"
          size="2x"
          icon={faReact} />
        <Icon
          type="rounded"
          size="2x"
          icon={faNodeJs} />
        <Icon
          type="rounded"
          size="2x"
          icon={faCss3} />
      </div>
    </Card>
  }
}

export default Index;
