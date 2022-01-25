const worker = function () {
  self.addEventListener("message", (e) => {
    if (e.data?.name === "ui-transition") {
      self.postMessage(e.data);
    }
  });
};

export default worker.toString().replace(/^function\s?\(\)\s?{|\}$/g, "");
