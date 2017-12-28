import React, { Component } from 'react'
import styles from './Background.module.css'
import circle1 from './circle1.png'
import circle2 from './circle2.png'

export default class BackgroundAnimation extends Component {
  render() {
    let window = global.window || {}
    const winW = window.innerWidth
    const winH = window.innerHeight
    return (
      <div className={styles.background}>
        {this.renderCircles(winW, winH)}
        {this.renderParticles(winW, winH)}
      </div>
    )
  }

  renderCircles(winW, winH) {
    const circles = []
    const offsetX = winW / 18
    for (let i = 0; i < 36; i++) {
      const size = `${Math.round(Math.random() * (winW / 2) + winW / 2)}px`
      const wPx = offsetX * i
      const inlineStyle = {
        left: `${Math.round(Math.random() * 100 - 50 + wPx)}px`,
        top: `${window.innerHeight}px`,
        width: size,
        height: size,
        opacity: Math.random() * 0.2 + 0.8,
        animationDelay: `${Math.random() * 6}s`,
        animationDuration: `${Math.random() * 3 + 9}s`,
      }
      circles[i] = (
        <img
          src={i % 2 === 0 ? circle1 : circle2}
          className={styles.circle}
          style={inlineStyle}
          key={i}
          alt="Background element"
        />
      )
    }
    return circles
  }

  renderParticles(winW, winH) {
    const particles = []
    for (let i = 0; i < 50; i++) {
      const orbit = Math.random() * (winW * 0.5)
      const orbitStyle = {
        left: `${winW * 0.5 + Math.random() * (winW * 0.5) - winW * 0.25}px`,
        top: `${winH * 0.5 + Math.random() * (winH * 0.5) - winH * 0.25}px`,
        width: `${orbit}px`,
        height: `${orbit}px`,
        marginLeft: `${orbit / -2}px`,
        marginRight: `${orbit / -2}px`,
        animationDuration: `${Math.random() * 5 + 10}s`,
      }
      const size = Math.round(Math.random() * 5 + 2)
      const particleStyle = {
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${size}px`,
        opacity: Math.random() * 0.5 + 0.25,
      }
      particles[i] = (
        <div key={i} className={styles.particleOrbit} style={orbitStyle}>
          <span className={styles.particleShape} style={particleStyle} />
        </div>
      )
    }
    return particles
  }
}
