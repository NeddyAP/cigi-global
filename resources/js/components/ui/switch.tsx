import * as React from "react"
import { Checkbox } from "./checkbox"
import { cn } from "@/lib/utils"

interface SwitchProps extends Omit<React.ComponentPropsWithoutRef<typeof Checkbox>, 'onCheckedChange'> {
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<
  React.ElementRef<typeof Checkbox>,
  SwitchProps
>(({ className, onCheckedChange, ...props }, ref) => (
  <Checkbox
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    onCheckedChange={onCheckedChange}
    {...props}
    ref={ref}
  />
))
Switch.displayName = "Switch"

export { Switch }
