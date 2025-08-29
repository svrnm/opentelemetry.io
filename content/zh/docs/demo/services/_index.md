---
title: 服务列表
aliases: [ service_table, service-table ]
---

要查看请求流程，参阅[服务架构图](../architecture/)。

| 服务名称                                  | 编程语言                 | 描述                                                                                                                                                                                |
| ------------------------------------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [accounting](accounting/)             | .NET | 处理传入订单并计算所有订单的总金额（模拟服务）。                                                                                                                                                          |
| [ad](ad/)                             | Java                 | 根据给定的上下文关键词提供文字广告。                                                                                                                                                                |
| [cart](cart/)                         | .NET | 将用户购物车中的商品存储在 Valkey 中，并可检索这些商品。                                                                                                                                                  |
| [checkout](checkout/)                 | Go                   | 获取用户购物车信息，准备订单，并协调付款、发货以及发送邮件通知的流程。                                                                                                                                               |
| [currency](currency/)                 | C++                  | Converts one money amount to another currency. Uses real values fetched from European Central Bank. It's the highest QPS service. |
| [email](email/)                       | Ruby                 | 向用户发送订单确认邮件（模拟服务）。                                                                                                                                                                |
| [fraud-detection](fraud-detection/)   | Kotlin               | 分析传入订单并检测欺诈行为（模拟服务）。                                                                                                                                                              |
| [frontend](frontend/)                 | TypeScript           | Exposes an HTTP server to serve the website. Does not require sign up / login and generates session IDs for all users automatically.              |
| [load-generator](load-generator/)     | Python/Locust        | 持续向前端发送请求，模拟真实用户的购物流程。                                                                                                                                                            |
| [payment](payment/)                   | JavaScript           | 使用提供的信用卡信息（模拟服务）扣款并返回交易 ID。                                                                                                                                                       |
| [product-catalog](product-catalog/)   | Go                   | 从 JSON 文件中提供商品列表，并支持搜索商品及获取单个商品信息。                                                                                                                                                |
| [quote](quote/)                       | PHP                  | 根据需要配送的商品数量计算运费。                                                                                                                                                                  |
| [recommendation](recommendation/)     | Python               | 根据购物车中的商品推荐其他商品。                                                                                                                                                                  |
| [shipping](shipping/)                 | Rust                 | 根据购物车内容估算运费，并将商品发往指定地址（模拟服务）。 Ships items to the given address (mock/).                                                                        |
| [react-native-app](react-native-app/) | TypeScript           | 使用 React Native 构建的移动应用，为购物服务提供用户界面。                                                                                                                                              |
