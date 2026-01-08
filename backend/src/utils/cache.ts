// “I implemented an in-memory cache with TTL for Codeforces stats to avoid unnecessary external API calls. 
// Stats are cached for 5 minutes, which balances freshness and performance. 
// The cache layer is abstracted so it can later be replaced with Redis.”

// why not reddis
// bcz this is a single instance(only one running copy of backend application exists at a time), low traffic system
// i used an in-memory ttl cache for simplicity.
// the cache layer is abstracted , so redis can be introduced when scaling becomes necessary

// every design choice involves trade-offs, and i chose based on scale and requirements

// this cache entry holds data of some type T,and an expiry time
// <T> is compile time only and erased at runtime , js never see <T>
type CacheEntry<T> = {
    data: T,
    expiresAt: number
}
class InMemoryCache {
    private store = new Map<string,CacheEntry<any>>();
    // this tries to read cached data
    get<T>(key: string): T | null {
        const entry = this.store.get(key);
        if(!entry) return null;
        if(Date.now() > entry.expiresAt){
            this.store.delete(key);
            return null;
        }
        return entry.data;
    }
    // this stores data in cache
    set<T>(key:string,data:T,ttlMs:number){
        this.store.set(key,{
            data,
            expiresAt: Date.now() + ttlMs,
        });
    }
}
export const cache = new InMemoryCache();