import { Entry } from "./Entry";


export class EntryUtil {
   /** 未使用节点 */
   protected static _unused: Entry;

   /**
    * 分配一个节点入口。
    *
    * @return 节点入口
    */
   public static alloc(): Entry {
      var entry: Entry = null as any;
      var unused = this._unused;
      if (unused) {
         entry = unused;
         this._unused = unused.next;
      } else {
         entry = new Entry();
      }
      return entry;
   }

   /**
    * 回收一个节点入口。
    *
    * @param entry 节点入口
    */
   public static free(entry: Entry) {
      entry.dispose();
      entry.next = this._unused;
      this._unused = entry;
   }
}
