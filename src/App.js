import React, { Component } from 'react';
import './App.css';
import { ACTIVITIES } from './activities';
import { SPRITELIST } from './spriteList';
import { randomChoice, capitalizeFirst } from './utils';
import soulName from './name/soulName';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sprite: randomSprite(),
      sprites: [],
    }
  }
  render() {
    const den = this.state.sprites.map(sprite => <DenSprite sprite={sprite} />)
    const leftDen = [];
    const rightDen = [];
    for (let i = 0; i < den.length; i++) {
      i % 2 === 0 ? leftDen.push(den[i]) : rightDen.push(den[i]);
    }
    let choices = [];
    while (choices.length < 3) {
      choices.push(randomChoice(this.state.sprite.preferences));
      if (choices.length === 3 &&
        (choices[0].name === choices[1].name ||
          choices[0].name === choices[2].name ||
          choices[1].name === choices[2].name)) {
        choices = [];
      }
    }
    const buttons = [...choices].map(activity => {
      const newSprite = Object.assign({}, this.state.sprite, {patience: this.state.sprite.patience - 1});
      newSprite.affection += activity.enjoyment;
      return (<ActivityButton
        activity={activity}
        sprite={newSprite}
        onClick={() => {
          if (newSprite.patience < 0) {
            this.setState({sprite: randomSprite()});
          } else if (newSprite.affection > 5) {
            const newSprites = this.state.sprites.slice();
            newSprites.push(this.state.sprite);
            this.setState({sprite: randomSprite(), sprites: newSprites});
          } else {
            this.setState({sprite: newSprite});
          }
        }}
      />);
    });
    return (
      <div className="app">
        <div className="den">
          {leftDen}
        </div>
        <div className="interaction-area">
          <h1>{this.state.sprite.patience === 10 ? `Let's be friends!` : `Turns left: ${this.state.sprite.patience}`}</h1>
          <img
            src={`/img/sprites/${this.state.sprite.species}/${this.state.sprite.variant}.png`}
            alt={`${this.state.sprite.variant} ${this.state.sprite.species}`}
          />
          <div>{"💖".repeat(Math.max(0, this.state.sprite.affection))}</div>
          {buttons}
        </div>
        <div className="den">
          {rightDen}
        </div>
      </div>
    );
  }
}

function ActivityButton(props) {
  return(
    <div
      className="activity"
      onClick={props.onClick}
    >
      {props.activity.name(props.sprite)}
    </div>
  )
}

function DenSprite(props) {
  return(
    <img
      src={`/img/sprites/${props.sprite.species}/${props.sprite.variant}.png`}
      alt={`${props.sprite.variant} ${props.sprite.species}`}
    />
  )
}

function randomSprite() {
  const species = randomChoice(Object.keys(SPRITELIST));
  const variant = randomChoice(SPRITELIST[species]);
  const sprite = {
    name: capitalizeFirst(soulName()),
    species: species,
    variant: variant,
    affection: 0,
    patience: 10,
    preferences: ACTIVITIES.map(activity => {
      const newActivity = Object.assign({}, activity);
      if (Math.random() > 0.5) {
        newActivity.enjoyment = 1;
      } else {
        newActivity.enjoyment = 0;
      }
      return newActivity;
    }),
  }
  return sprite;
}

export default App;
