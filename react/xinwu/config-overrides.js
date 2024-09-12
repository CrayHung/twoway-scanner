// config-overrides.js
module.exports = function override(config, env) {
    // 在這裡修改配置，例如禁用 HMR
    if (env === 'development') {
      config.devServer.hot = false;
    }
  
    return config;
  };
  