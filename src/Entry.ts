export class Entry {
   // 下一个节点
   public next: Entry;
   // 内容
   public value: any;
   constructor() {
      this.next = null as any;
      this.value = null;
   }

   /**
    * 释放处理。
    */
   public dispose() {
      this.next = null as any;
      this.value = null;
   }
}