"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback: ReactNode;
}
interface State {
  hasError: boolean;
}

/**
 * Catches any failure inside the 3D scene (missing WebGL, a texture/asset
 * that fails to load, driver quirks) and renders a graceful fallback instead
 * of crashing the whole page. The hero must never hard-fail on a device
 * without WebGL or a flaky network.
 */
export class ThreeErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[3D] falling back to static hero:", error);
    }
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
