import { MemoryPool } from './MemoryPool';

export class MemoryUtil {
   /** 缓冲池 */
   public static pools: Array<MemoryPool> = new Array<MemoryPool>();

   /**
    * 根据类型获得缓冲池实例。
    *
    * @param clazz 类函数
    * @return 实例
    */
   public static findPool(clazz: Function): MemoryPool {
      var prototype = clazz.prototype;
      // 获得缓冲池
      var pool = prototype.__pool as MemoryPool;
      if (pool) { // 该类型上是否有内存池
         if (pool.type === clazz) {
            return pool as any;
         }
      } else {
         // 创建缓冲池
         pool = prototype.__pool = new MemoryPool();
         pool.type = clazz;
         MemoryUtil.pools.push(pool);
         return pool as any;
      }
      return null as any;
   }

   /**
    * 收集一个类对象的实例。
    *
    * @param clazz 类函数
    * @return 实例
    */
   public static alloc(clazz: Function, free: boolean = true): any {
      // 创建对象
      var pool = MemoryUtil.findPool(clazz);
      var value = pool.alloc(free);
      return value;
   }

   /**
    * 收集一个类对象的实例。
    *
    * @param clazz 类函数
    * @return 实例
    */
   public static allocArray(clazz: Function, count: number, free: boolean = true): any {
      var prototype = clazz.prototype;
      // 创建对象
      var pool = MemoryUtil.findPool(clazz);
      var result = new Array<any>();
      for (var i = 0; i < count; i++) {
         var value = pool.alloc(free);
         result.push(value);
      }
      return result;
   }

   /**
    * 释放一个实例。
    *
    * @param value 实例
    * @param free 释放
    */
   public static free(value: any, free: boolean = false): any {
      var pool = value.__pool as MemoryPool;
      if (pool) {
         pool.free(value, free);
      }
      return null;
   }

   /**
    * 释放一个实例。
    *
    * @param value 实例
    * @param free 释放
    */
   public static freeArray(values: Array<any>, free: boolean = false) {
      var count = values.length;
      if (count > 0) {
         var pool = values[0].__pool as MemoryPool;
         for (var i = 0; i < count; i++) {
            var value = values[i];
            pool.free(value, free);
            values[i] = null;
         }
      }
      return null;
   }

   /**
    * 强制释放当前内存中所有对象实例。
    */
   public static dump() {
      var pools = MemoryUtil.pools;
      var count = pools.length;
      for (var i = 0; i < count; i++) {
         console.log(pools[i]);
      }
   }

   /**
    * 强制释放当前内存中所有对象实例。
    */
   public static refresh() {
      eval('CollectGarbage()');
   }
}
