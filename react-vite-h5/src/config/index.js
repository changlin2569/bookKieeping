const MODE = import.meta.env.MODE // 环境变量

export const baseUrl = MODE == 'development' ? 'http://api.chennick.wang/api/' : 'http://api.chennick.wang'