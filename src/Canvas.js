import React, { useRef, useEffect, useState, useCallback } from 'react';
import groundGif from './img/ground.gif';
import questionGif from './img/question.gif';
import brickGif from './img/brick.gif';
import marioGif from './img/mario.gif';
// import marioWalk1 from './img/marioWalk1.gif';
// import marioWalk2 from './img/marioWalk2.gif';
// import marioWalk3 from './img/marioWalk3.gif';

// https://stackoverflow.com/questions/48130461/how-to-make-my-character-jump-with-gravity

const Canvas = () => {
  const canvasRef = useRef(null);
  const requestRef = useRef();

  const jumpRef = useRef(false);
  const jumpHeightRef = useRef(0);
  const moveRef = useRef('');
  const loadingRef = useRef(false);
  const STARTMARIO = { x: 150, y: 300 };
  const [mario, setMario] = useState({
    x: STARTMARIO.x,
    y: STARTMARIO.y,
    dx: 0.4,
    dy: 0.1,
    moveSpeed: 4,
    jump: 100,
    gravity: 0.8,
    source: marioGif,
  });
  const marioXRef = useRef(STARTMARIO.x);
  const marioYRef = useRef(STARTMARIO.y);
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
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 3, 2, 2, 2, 2, 0, 
      0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    ],
    getTile: function (col, row) {
      return this.tiles[row * map.cols + col];
    },
  };
  const WIDTH = 512;
  const HEIGHT = 512;
  const WORLD_TILES = 16;
  const TILE_SIZE = 32;
  const SIZE_WIDTH = 25;
  const SIZE_HEIGHT = 30;

  const draw = (ctx) => {
    const mario1 = new Image();
    mario1.src = marioGif;
    ctx.drawImage(
      mario1,
      marioXRef.current,
      marioYRef.current,
      SIZE_WIDTH,
      SIZE_HEIGHT
    );
  };

  const getMapCoordinatesFromPosition = (x, y, direction) => {
    if (direction === 'right' || direction === 'left') {
      const colTile = Math.floor(Math.floor(x) / TILE_SIZE);
      const rowTile1 = Math.floor((Math.floor(y) + SIZE_HEIGHT) / TILE_SIZE);
      const rowTile2 = Math.floor(Math.floor(y) / TILE_SIZE);
      const res1 = map.getTile(colTile, rowTile1);
      const res2 = map.getTile(colTile, rowTile2);
      if (x + 3 > WIDTH || x <= 0) return 2;
      if (res1 === 0 && res2 === 0) return 1;
      return 2;
    } else if (direction === 'up') {
      const colTile1 = Math.floor((x + SIZE_WIDTH) / TILE_SIZE);
      const colTile2 = Math.floor(x / TILE_SIZE);
      const rowTile = Math.floor(y / TILE_SIZE);
      const res1 = map.getTile(colTile1, rowTile);
      const res2 = map.getTile(colTile2, rowTile);

      if (y + 3 > HEIGHT || y < 0) return false;
      if (res1 !== 0 || res2 !== 0) return false;
    } else {
      const colTile1 = Math.floor((x + SIZE_WIDTH) / TILE_SIZE);
      const colTile2 = Math.floor(x / TILE_SIZE);
      const rowTile = Math.floor(y / TILE_SIZE);
      const res1 = map.getTile(colTile1, rowTile);
      const res2 = map.getTile(colTile2, rowTile);
      if (y + 3 > HEIGHT || y < 0) return 2;
      if (res1 === 0 && res2 === 0) return 1;
      return 2;
    }
  };

  const gravity = () => {
    const res = getMapCoordinatesFromPosition(
      Math.floor(mario.x),
      Math.floor(mario.y) + SIZE_HEIGHT + mario.gravity + 1,
      'gravity'
    );
    if (jumpRef.current === true) return;
    if (marioYRef.current + SIZE_HEIGHT > HEIGHT - TILE_SIZE * 2 || res === 2)
      return;

    marioYRef.current = marioYRef.current + mario.gravity;
    setMario((prev) => ({
      ...prev,

      y: prev.y + mario.gravity,
    }));
  };
  const jump = () => {
    if (jumpRef.current === true) {
      jumpHeightRef.current = jumpHeightRef.current + 1;
      if (jumpHeightRef.current > mario.jump) {
        jumpRef.current = false;
        jumpHeightRef.current = 0;
        return;
      }
      const res = getMapCoordinatesFromPosition(mario.x, mario.y - 1, 'up');
      if (res === false) {
        jumpRef.current = false;
        jumpHeightRef.current = 0;
        return;
      }
      marioYRef.current = marioYRef.current - 1;

      setMario((prev) => ({
        ...prev,

        y: prev.y - 1,
      }));
    }
  };
  const move = () => {
    if (moveRef.current === 'right') {
      moveRef.current = '';
      const checkRight = getMapCoordinatesFromPosition(
        mario.x + mario.dx + SIZE_WIDTH,
        mario.y,
        'right'
      );
      if (checkRight !== 1) return setMario((prevState) => ({ ...prevState }));
      marioXRef.current = marioXRef.current + mario.moveSpeed;
      return setMario((prevState) => ({
        ...prevState,
        x: prevState.x + mario.moveSpeed,
      }));
    } else if (moveRef.current === 'left') {
      moveRef.current = '';
      const checkLeft = getMapCoordinatesFromPosition(
        mario.x - mario.moveSpeed,
        mario.y,
        'left'
      );
      if (checkLeft !== 1) return setMario((prevState) => ({ ...prevState }));
      marioXRef.current = marioXRef.current - mario.moveSpeed;
      return setMario((prevState) => ({
        ...prevState,
        x: prevState.x - mario.moveSpeed,
      }));
    } else if (moveRef.current === 'down') {
      moveRef.current = '';
      const checkDown = getMapCoordinatesFromPosition(
        mario.x,
        mario.y + SIZE_HEIGHT + mario.moveSpeed,
        'down'
      );
      if (checkDown !== 1) return setMario((prevState) => ({ ...prevState }));
      marioYRef.current = marioYRef.current + mario.moveSpeed;
      return setMario((prevState) => ({
        ...prevState,
        y: prevState.y + mario.moveSpeed,
      }));
    }
  };
  const update = () => {
    gravity();
    jump();
    move();
  };
  const listener = useCallback((e) => {
    e.preventDefault();
    switch (e.code) {
      case 'ArrowRight':
        console.log('right');
        return (moveRef.current = 'right');
      case 'ArrowLeft':
        return (moveRef.current = 'left');
      case 'ArrowUp':
        console.log('up');
        return (jumpRef.current = true);
      case 'ArrowDown':
        return (moveRef.current = 'down');
      default:
        break;
    }
  }, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps

  const setBackGround = async (ctx) => {
    loadingRef.current = true;
    const brick = new Image();
    const ground = new Image();
    const question = new Image();
    brick.src = brickGif;
    ground.src = groundGif;
    question.src = questionGif;
    const arr = [ground, brick, question];
    for (var c = 0; c < WORLD_TILES; c++) {
      for (var r = 0; r < WORLD_TILES; r++) {
        var tile = map.getTile(c, r);
        if (tile !== 0) {
          ctx.drawImage(
            arr[tile - 1],
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
    loadingRef.current = false;
  };

  const animate = () => {
    update();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    draw(ctx);
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#548CFF';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    document.addEventListener('keydown', listener);
    const getBackGround = async () => {
      await setBackGround(ctx);
    };
    getBackGround();
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(requestRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listener, update]);
  return (
    <>
      {loadingRef.current ? <h1> loading...</h1> : <canvas ref={canvasRef} />}
    </>
  );
};

export default Canvas;
