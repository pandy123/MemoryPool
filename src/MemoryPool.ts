import { EntryUtil } from "./EntryUtil";
import { Entry } from "./Entry";



export class MemoryPool {
   /** 类型 */
   public type: Function;
   /** 创建个数 */
   public createCount: number;
   /** 收集个数 */
   public allocCount: number;
   /** 自由个数 */
   public freeCount: number;
   /** 未使用节点 */
   protected _unused: Entry;

   /**
    * 构造处理。
    *
    * @param type 类型
    */
   public constructor(type?: Function) {
      this.type = type as any;
      this.createCount = 0;
      this.allocCount = 0;
      this.freeCount = 0;
      this._unused = null as any;
   }

   /**
    * 收集一个自由对象。
    *
    * @param free 释放
    * @return 对象
    */
   public alloc(free?: boolean): any {
      var value: any = null;
      // 是否存在未使用的内存实例
      var unused = this._unused;
      if (unused) {
         // 存在未使用的内存实例
         value = unused.value;
         this._unused = unused.next;
         // 释放资源
         if (free && value.free) {
            value.free();
         }
         // 回收一个节点入口
         EntryUtil.free(unused);
      } else {
         value = new (this.type as any)();
         value.__pool = this;
         this.createCount++;
      }
      this.allocCount++;
      value.__used = true;
      return value;
   }

   /**
    * 释放一个自由对象。
    *
    * @param value 对象
    * @param free 释放
    */
   public free(value: any, free?: boolean): void {
      // 释放资源
      if (free && value.free) {
         value.free();
      }
      value.__used = false;
      // 放回缓冲池
      var entry = EntryUtil.alloc() as Entry;
      entry.value = value;
      entry.next = this._unused;
      this._unused = entry;
      this.freeCount++;
   }

   /**
    * 释放当前实例。
    */
   public dispose() {
      var entry = this._unused;
      while (entry) {
         var current = entry;
         entry = current.next;
         // 释放内容
         var value = current.value;
         value.__pool = null;
         value.__used = false;
         if (value.dispose) {
            value.dispose();
         }
         current.dispose();
         // 释放节点
         EntryUtil.free(current);
      }
   }
}
