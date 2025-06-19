export function showToast(message: string) {
    const toast = document.createElement("div");
    toast.className = "toast-message";
    toast.textContent = message;
  
    document.body.appendChild(toast);
  
    setTimeout(() => toast.classList.add("show"), 10);
  
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }