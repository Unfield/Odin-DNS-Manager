declare global {
  namespace App {
    interface Locals {
      user: {
        id: string;
        username: string;
        email: string;
        avatar: string;
        token: string;
      };
    }
    namespace Superforms {
      type Message = {
        type: "error" | "success";
        text: string;
      };
    }
  }
}

export {};
