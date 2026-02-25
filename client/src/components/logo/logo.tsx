import { PROTECTED_ROUTES } from "@/routes/common/routePath"
import { GalleryVerticalEnd } from "lucide-react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

const Logo = (props: { url?: string }) => {
  return (
    <Link to={props.url || PROTECTED_ROUTES.OVERVIEW} className="flex items-center gap-2 group">
      <motion.div
        whileHover={{ scale: 1.15, rotate: -5 }}
        whileTap={{ scale: 0.9 }}
        className="bg-gradient-to-br from-primary to-blue-600 text-white h-7 w-7 rounded-lg flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-all duration-300"
      >
        <GalleryVerticalEnd className="size-4.5" />
      </motion.div>
      <motion.span
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="font-black text-2xl tracking-tighter glow-text"
      >
        Finora
      </motion.span>
    </Link>
  )
}

export default Logo