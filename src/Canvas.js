import React, { useRef, useEffect, useState, useCallback } from 'react';
import groundGif from './img/ground.gif';
import questionGif from './img/question.gif';
import brickGif from './img/brick.gif';
import question1 from './img/question1.gif';
import question2 from './img/question2.gif';
import question3 from './img/question3.gif';
import marioGif from './img/mario.gif';
import marioWalk1Gif from './img/marioWalk1.gif';
import marioWalk2Gif from './img/marioWalk2.gif';
import marioWalk3Gif from './img/marioWalk3.gif';
import pipeGif from './img/Pipe.gif';

// import marioMirrorGif from './img/mario_mirrored.gif';
// import marioWalk1MirrorGif from './img/marioWalk1_mirrored.gif';
// import marioWalk2MirrorGif from './img/marioWalk2_mirrored.gif';
// import marioWalk3MirrorGif from './img/marioWalk3_mirrored.gif';

import largeHill from './img/hillLarge.gif';
import smallHill from './img/hillSmall.gif';
// import bushSingle from './img/bushSingle.gif';
// import bushDouble from './img/bushDouble.gif';
import bushTriple from './img/bushTriple.gif';
import cloudSingle from './img/cloudSingle.gif';
import title from './img/superMarioTitle.png';

// https://stackoverflow.com/questions/48130461/how-to-make-my-character-jump-with-gravity

const Canvas = () => {
  const canvasRef = useRef(null);
  const requestRef = useRef();
  const STARTMARIO = { x: 150, y: 300 };
  const iRef = useRef(0);
  const marioWalkRef = useRef(0);

  const [mario, setMario] = useState({
    x: STARTMARIO.x,
    y: STARTMARIO.y,
    dx: 0,
    dy: 0,
    moveSpeed: 1.5,
    jump: 20,
    gravity: 1.5,
    jumpPower: 6,
    source: marioGif,
  });

  const viewport = {};

  const playerRef = useRef({
    marioX: STARTMARIO.x,
    marioY: STARTMARIO.y,
    dx: 0,
    dy: 0,
    moveLeft: false,
    moveRight: false,
    moveDown: false,
    moveAny: false,
    jump: false,
    jumpHeight: 0,
    ground: false,
    scene: 0,
  });

  const world = {
    gravity: 0.2, // strength per frame of gravity
    drag: 0.999, // play with this value to change drag
    groundDrag: 0.9, // play with this value to change ground movement
    ground: 150,
  };

  const map = {
    cols: 16,
    rows: 16,
    // prettier-ignore
    tiles: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 2, 3, 2, 3, 2, 
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,

    ],
    // prettier-ignore
    tilesArr: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 2, 3, 2, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ],
    getTile: function (col, row) {
      return this.tiles[row * map.cols + col];
    },
    getTileByArr: function (col, row, scene = 0) {
      let targetTile = this.tilesArr[row][col + scene];

      return targetTile;
    },
  };
  const WIDTH = 512;
  const HEIGHT = 512;
  const WORLD_TILES = 16;
  const TILE_SIZE = 32;
  const SIZE_WIDTH = 25;
  const SIZE_HEIGHT = 30;
  const GROUND = 380;

  const draw = (ctx) => {
    const mario1 = new Image();
    mario1.src = marioGif;

    const marioWalk1 = new Image();
    marioWalk1.src = marioWalk1Gif;
    const marioWalk2 = new Image();
    marioWalk2.src = marioWalk2Gif;
    const marioWalk3 = new Image();
    marioWalk3.src = marioWalk3Gif;

    const marioWalk = [marioWalk1, marioWalk2, marioWalk3];

    let marioCurrent;
    if (playerRef.current.moveRight !== true) {
      marioCurrent = mario1;
    } else {
      marioCurrent = marioWalk[marioWalkRef.current];
    }

    ctx.drawImage(
      marioCurrent,
      playerRef.current.marioX,
      playerRef.current.marioY,
      SIZE_WIDTH,
      SIZE_HEIGHT
    );
  };

  const getMapPosition = (x, y, direction) => {
    const colTileLeft = Math.floor(x / TILE_SIZE);
    const colTileRight = Math.floor((x + SIZE_WIDTH) / TILE_SIZE);
    const rowTileUp = Math.floor(y / TILE_SIZE);
    const rowTileBottom = Math.floor((y + SIZE_HEIGHT) / TILE_SIZE);

    const leftUp = map.getTile(colTileLeft, rowTileUp);
    const leftBottom = map.getTile(colTileLeft, rowTileBottom);
    const rightUp = map.getTile(colTileRight, rowTileUp);
    const rightBottom = map.getTile(colTileRight, rowTileBottom);

    switch (direction) {
      case 'right':
        if (x + SIZE_WIDTH + mario.moveSpeed > WIDTH / 2) {
          return 2;
        }
        if (rightUp === 0 && rightBottom === 0) return 1;
        return 2;
      case 'left':
        if (x <= 0) return 2;
        if (leftUp === 0 && leftBottom === 0) return 1;
        return 2;
      case 'up':
        if (y + mario.jump > HEIGHT) return false;
        if (rightUp !== 0 || leftUp !== 0) {
          return false;
        }
        return true;
      case 'down':
      case 'gravity':
        if (y < 0) return 2;
        if (rightBottom === 0 && leftBottom === 0) return 1;
        return 2;
      default:
        break;
    }
  };

  const collision = () => {
    const rightCollision = getMapPosition(
      playerRef.current.marioX + 5,
      playerRef.current.marioY,
      'right'
    );
    if (rightCollision !== 1) {
      console.log('right collision');
    }
    const leftCollision = getMapPosition(
      playerRef.current.marioX - 5,
      playerRef.current.marioY,
      'left'
    );
    if (leftCollision !== 1) {
      console.log('left collision');
    }
    const topCollision = getMapPosition(
      playerRef.current.marioX,
      playerRef.current.marioY - 5,
      'up'
    );
    if (topCollision === 3) {
      console.log('question Box');
    }

    const bottomCollision = getMapPosition(
      playerRef.current.marioX,
      playerRef.current.marioY + 5,
      'down'
    );
    if (bottomCollision !== 1) {
      // console.log('bottom collision');
    }
  };

  const gravity = () => {
    if (playerRef.current.marioY + SIZE_HEIGHT > HEIGHT - TILE_SIZE * 2) return;

    const res = getMapPosition(
      Math.floor(playerRef.current.marioX),
      Math.floor(playerRef.current.marioY) + mario.gravity + 1,
      'gravity'
    );
    if (res === 2) return (playerRef.current.ground = true);
    if (res !== 2) {
      playerRef.current.ground = false;
    }

    playerRef.current.marioY = playerRef.current.marioY + mario.gravity;
    setMario((prev) => ({
      ...prev,
      y: prev.y + mario.gravity,
    }));
  };

  const jump = () => {
    if (
      playerRef.current.jump === true &&
      playerRef.current.jumpHeight < mario.jump
    ) {
      const res = getMapPosition(
        playerRef.current.marioX,
        playerRef.current.marioY - mario.jumpPower,
        'up'
      );

      if (res === false) return (playerRef.current.jump = false);
      playerRef.current.marioY = playerRef.current.marioY - mario.jumpPower;
      setMario((prev) => ({
        ...prev,
        y: prev.y - mario.jumpPower,
      }));

      playerRef.current.jumpHeight = playerRef.current.jumpHeight + 1;
    } else if (playerRef.current.jumpHeight >= mario.jump) {
      playerRef.current.jumpHeight = 0;
      playerRef.current.jump = false;
    }
  };

  const move = () => {
    if (playerRef.current.moveRight === true) {
      const checkRight = getMapPosition(
        playerRef.current.marioX + mario.moveSpeed,
        playerRef.current.marioY,
        'right'
      );
      if (checkRight !== 1) return setMario((prevState) => ({ ...prevState }));
      playerRef.current.marioX =
        playerRef.current.marioX * world.drag + mario.moveSpeed;
      return setMario((prevState) => ({
        ...prevState,
        x: prevState.x * world.drag + mario.moveSpeed,
      }));
    } else if (playerRef.current.moveLeft === true) {
      const checkLeft = getMapPosition(
        playerRef.current.marioX - mario.moveSpeed,
        playerRef.current.marioY,
        'left'
      );
      if (checkLeft !== 1) return setMario((prevState) => ({ ...prevState }));
      playerRef.current.marioX = playerRef.current.marioX - mario.moveSpeed;
      return setMario((prevState) => ({
        ...prevState,
        x: prevState.x - mario.moveSpeed,
      }));
    } else if (playerRef.current.moveDown === true) {
      const checkDown = getMapPosition(
        playerRef.current.marioX,
        playerRef.current.marioY + mario.moveSpeed,
        'down'
      );
      if (checkDown !== 1) return setMario((prevState) => ({ ...prevState }));
      playerRef.current.marioY = playerRef.current.marioY + mario.moveSpeed;
      return setMario((prevState) => ({
        ...prevState,
        y: prevState.y + mario.moveSpeed,
      }));
    }
  };
  const update = () => {
    jump();
    gravity();
    move();
    collision();
  };
  const listener = useCallback((e) => {
    e.preventDefault();
    const state = e.type === 'keydown';
    if (state) {
      playerRef.current.moveAny = true;
    }
    switch (e.code) {
      case 'ArrowRight':
        return (playerRef.current.moveRight = state);
      case 'ArrowLeft':
        return (playerRef.current.moveLeft = state);
      case 'ArrowUp':
        if (
          playerRef.current.ground === true &&
          playerRef.current.jump === false
        ) {
          return (playerRef.current.jump = state);
        }
        return playerRef.current.jump;
      case 'ArrowDown':
        return (playerRef.current.moveDown = state);
      default:
        break;
    }
  }, []);

  const setBackGround = async (ctx) => {
    const brick = new Image();
    const ground = new Image();
    const question = new Image();

    const questionGif1 = new Image();
    const questionGif2 = new Image();
    const questionGif3 = new Image();

    questionGif1.src = question1;
    questionGif2.src = question2;
    questionGif3.src = question3;
    let questionGifArr = [questionGif3, questionGif3, questionGif3];
    if (playerRef.current.moveLeft === false) {
      questionGifArr = [questionGif1, questionGif2, questionGif3];
    }

    brick.src = brickGif;
    ground.src = groundGif;
    question.src = questionGif;
    const arr = [ground, brick, question];

    for (var c = 0; c < WORLD_TILES; c++) {
      for (var r = 0; r < WORLD_TILES; r++) {
        var tile = map.getTileByArr(c, r, playerRef.current.scene);

        let targetImg = arr[tile - 1];
        if (tile === 3) {
          targetImg = questionGifArr[iRef.current];
        }
        if (tile !== 0) {
          ctx.drawImage(
            targetImg,
            0,
            0,
            TILE_SIZE, // source width
            TILE_SIZE, // source height
            c * TILE_SIZE, // target x
            r * TILE_SIZE, // target y
            TILE_SIZE, // target width
            TILE_SIZE
          );
        }
      }
    }
  };

  const animate = () => {
    update();
    const canvas = canvasRef.current;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#548CFF';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    const hill_large = new Image();
    const hill_small = new Image();
    const cloud_single = new Image();
    const bush_triple = new Image();
    const marioTitle = new Image();

    hill_large.src = largeHill;
    hill_small.src = smallHill;
    cloud_single.src = cloudSingle;
    bush_triple.src = bushTriple;
    marioTitle.src = title;

    if (playerRef.current.marioX >= WIDTH / 2 - mario.moveSpeed) {
      console.log('hi');
    }
    ctx.drawImage(
      marioTitle,
      20 - playerRef.current.scene * TILE_SIZE,
      TILE_SIZE * 2,
      380,
      250
    );
    ctx.drawImage(
      cloud_single,
      450 - playerRef.current.scene * TILE_SIZE,
      TILE_SIZE * 2
    );
    ctx.drawImage(hill_large, 20 - playerRef.current.scene * TILE_SIZE, GROUND);
    ctx.drawImage(
      hill_small,
      380 - playerRef.current.scene * TILE_SIZE,
      GROUND + TILE_SIZE
    );
    ctx.drawImage(
      bush_triple,
      250 - playerRef.current.scene * TILE_SIZE,
      GROUND + TILE_SIZE + 4
    );
    draw(ctx);
    const getBackGround = async () => {
      await setBackGround(ctx);
    };
    getBackGround();
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    document.addEventListener('keydown', listener);
    document.addEventListener('keyup', listener);
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(requestRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listener, update]);

  useEffect(() => {
    const interval = setInterval(() => {
      iRef.current += iRef.current + 1;
      marioWalkRef.current += marioWalkRef.current + 1;

      if (iRef.current === 3) {
        iRef.current = 0;
      }
      if (marioWalkRef.current > 2) {
        marioWalkRef.current = 0;
      }
    }, 150);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <>
      <canvas ref={canvasRef} />
    </>
  );
};

export default Canvas;
