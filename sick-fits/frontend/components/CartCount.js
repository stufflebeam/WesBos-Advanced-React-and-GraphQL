import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';

const CartCountStyles = styled.div`
  background: var(--red);
  color: white;
  border-radius: 50%;
  padding: 0.5rem;
  line-height: 2rem;
  min-width: 3rem;
  margin-left: 1rem;
  font-feature-settings: 'tnum';
  font-variant-numeric: tabular-nums;
  /* TODO: Play with the font-size and positioning of the count inside the dot a bit. 
           It seems ever-so-slightly off center. */
  font-size: 1.4rem;

  /* This was the GitHub CoPilot suggested animation code. It seems to pulse consistently. But, I wanted to leave it
     in here so that I can play with it a bit later on. */
  /* 
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 100; */
  /* This little bit of magic makes the animation happen */
  /* animation: pulse 0.5s ease-in-out infinite alternate;
  @keyframes pulse {
    from {
      transform: scale(1);
      opacity: 1;
    }
    to {
      transform: scale(1.2);
      opacity: 0.5;
    }
  } */
`;

const AnimationStyles = styled.span`
  position: relative;
  .count {
    position: relative;
    display: block;
    transition: transform 0.4s; /* This needs to match the timing in the CSSTransition's timeout prop */
    backface-visibility: hidden;
  }
  .count-enter {
    transform: scale(4) rotateX(0.5turn);
  }
  .count-enter-active {
    transform: rotateX(0);
  }
  .count-exit {
    top: 0;
    position: absolute;
    transform: rotateX(0);
  }
  .count-exit-active {
    transform: scale(4) rotateX(0.5turn);
  }
`;

export default function CartCount({ count }) {
  return (
    <AnimationStyles>
      <TransitionGroup>
        <CSSTransition
          unmountOnExit
          className="count"
          classNames="count"
          key={count}
          timeout={{ enter: 400, exit: 400 }}
        >
          <CartCountStyles>{count}</CartCountStyles>
        </CSSTransition>
      </TransitionGroup>
    </AnimationStyles>
  );
}
