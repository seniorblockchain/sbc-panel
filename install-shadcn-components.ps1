$components = @(
  "accordion", "alert", "alert-dialog", "aspect-ratio", "avatar", "badge", "button",
  "calendar", "card", "carousel", "checkbox", "collapsible", "command", "context-menu",
  "data-table", "date-picker", "dialog", "drawer", "dropdown-menu", "form", "hover-card",
  "input", "input-otp", "label", "menubar", "navigation-menu", "pagination", "popover",
  "progress", "radio-group", "resizable", "scroll-area", "select", "separator", "sheet",
  "skeleton", "slider", "sonner", "switch", "table", "tabs", "textarea", "toast", "toggle",
  "tooltip"
)

foreach ($component in $components) {
  Write-Host "🧩 Installing component: $component"
  npx shadcn@latest add $component
}
