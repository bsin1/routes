import styles from "src/react/styles/Overlay.module.css"

interface OverlayProps {
  children: React.ReactNode
}

const Overlay = ({ children }: OverlayProps) => {
  return <div className={styles.Overlay}>{children}</div>
}

export default Overlay
