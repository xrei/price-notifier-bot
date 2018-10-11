type nothing = null | undefined

class Maybe<T> {
  private val: T | nothing
  constructor(x: T | nothing) {
    this.val = x
  }
  static of<T>(x: T | nothing): Maybe<T> {
    return new Maybe<T>(x)
  }
  static Nothing<T>(): Maybe<T> {
    return new Maybe<T>(undefined)
  }
  isNothing(): boolean {
    return this.val === null || this.val === undefined
  }
  // map :: Monad m => (a -> b) -> m a -> m b
  map<Tʹ>(f: (value: T) => Tʹ | nothing): Maybe<Tʹ> {
    if (this.isNothing()) return Maybe.Nothing<Tʹ>()
    return Maybe.of(f(this.val!))
  }
  join(): T {
    return this.val!
  }
  // chain :: Monad m => (a -> m b) -> m a -> m b
  chain<U>(f: (v: T) => Maybe<U>): Maybe<U> {
    return this.map(f).join()
  }
  // ap :: Apply f => f a ~> f (a -> b) -> f b
  ap<U>(mfn: Maybe<(v: T) => U>): Maybe<U> {
    const r = (f: ((x: T) => U)) => Maybe.of(f(this.val!))
    return mfn.chain(r)
  }
  // orElse<U>(val: U): Maybe<U> | Maybe<T> {
  //   if (this.isNothing()) return Maybe.of(val)
  //   return Maybe.of(this.val)
  // }
}

export default Maybe
