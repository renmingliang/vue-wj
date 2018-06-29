export default {
  title: '《锦绣未央》手游付费测试调查问卷',
  context: {
    tips: '您的问卷已提交，感谢您的支持！我们通过邮箱为您发送了一份礼物，请注意查收~',
    help: '如有任何问题，可在游戏中点“更多”→“设置”→进入“客服中心”反馈'
  },
  lists: [
    {
      'iID': 1,
      'iTitle': '您的<span style="color:#ff0000;">性别</span>是？',
      'iType': 'radio',
      'iRequired': true,
      'iOptions': [
        { 'value': 'A', 'txt': '男', 'href': '' },
        { 'value': 'B', 'txt': '女', 'href': '' }
      ]
    },
    {
      'iID': 2,
      'iTitle': '您的<span style="color:#ff0000;">年龄</span>段是？',
      'iType': 'radio',
      'iRequired': true,
      'iOptions': [
        { 'value': 'A', 'txt': '15岁以下' },
        { 'value': 'B', 'txt': '16-20岁' },
        { 'value': 'C', 'txt': '21-25岁' },
        { 'value': 'D', 'txt': '26-30岁' },
        { 'value': 'E', 'txt': '31岁以上' }
      ]
    },
    {
      'iID': 3,
      'iTitle': '您是通过<span style="color:#ff0000;">哪种渠道</span>了解到《锦绣未央》手游的？',
      'iType': 'radio',
      'iRequired': true,
      'iOptions': [
        { 'value': 'A', 'txt': '粉丝QQ群' },
        { 'value': 'B', 'txt': '锦绣未央手游官网' },
        { 'value': 'C', 'txt': '锦绣未央手游公众号' },
        { 'value': 'D', 'txt': '朋友推荐' },
        { 'value': 'E', 'txt': '微博' },
        { 'value': 'F', 'txt': '其他', 'input': true, 'placeholder': '请填写(不超过300字)' }
      ]
    },
    {
      'iID': 4,
      'iTitle': '您曾经<span style="color:#ff0000;">是否参加过</span>《锦绣未央》手游的内测？',
      'iType': 'radio',
      'iRequired': true,
      'iOptions': [
        { 'value': 'A', 'txt': '参加过3月-锦绣精英测试' },
        { 'value': 'B', 'txt': '参加过4月-锦绣绮丽内测' },
        { 'value': 'C', 'txt': '两次锦绣内测都参加过' },
        { 'value': 'D', 'txt': '之前未参加过锦绣相关内测' }
      ]
    },
    {
      'iID': 5,
      'iTitle': '您平均每月在手机游戏上<span style="color:#ff0000;">花费</span>多少？',
      'iType': 'radio',
      'iRequired': true,
      'iOptions': [
        { 'value': 'A', 'txt': '不花费' },
        { 'value': 'B', 'txt': '100元以内' },
        { 'value': 'C', 'txt': '100-500元' },
        { 'value': 'D', 'txt': '500-2000元' },
        { 'value': 'E', 'txt': '2000元以上' }
      ]
    },
    {
      'iID': 6,
      'iTitle': '您是否会为《锦绣未央》手游<span style="color:#ff0000;">花费</span>呢？',
      'iType': 'radio',
      'iRequired': true,
      'iOptions': [
        { 'value': 'A', 'txt': '不花费' },
        { 'value': 'B', 'txt': '100元以内' },
        { 'value': 'C', 'txt': '100-500元' },
        { 'value': 'D', 'txt': '500-2000元' },
        { 'value': 'E', 'txt': '2000元以上' }
      ]
    },
    {
      'iID': 7,
      'iTitle': '您更倾向于在锦绣的哪些系统上进行<span style="color:#ff0000;">消费</span>呢？',
      'iType': 'radio',
      'iRequired': true,
      'iOptions': [
        { 'value': 'A', 'txt': '时装购买' },
        { 'value': 'B', 'txt': '体力或升级消耗道具购买' },
        { 'value': 'C', 'txt': '好友互动道具购买，如送花' },
        { 'value': 'D', 'txt': '首冲或限时超值礼包' },
        { 'value': 'E', 'txt': '长期返利活动' },
        { 'value': 'F', 'txt': '其他', 'input': true, 'placeholder': '请填写(不超过300字)' }
      ]
    },
    {
      'iID': 8,
      'iTitle': '您最喜欢的<span style="color:#ff0000;">手游类型</span>？[可多选]',
      'iType': 'checkbox',
      'iRequired': true,
      'iOptions': [
        { 'value': 'A', 'txt': '换装类游戏：如奇迹暖暖' },
        { 'value': 'B', 'txt': '剧情类游戏：如恋与制作人' },
        { 'value': 'C', 'txt': '卡牌养成类：如阴阳师' },
        { 'value': 'D', 'txt': '角色扮演类：如楚留香' },
        { 'value': 'E', 'txt': 'MOBA竞技类：如王者荣耀、决战平安京' },
        { 'value': 'F', 'txt': '竞速类：如QQ飞车' },
        { 'value': 'G', 'txt': '音乐舞蹈类：如QQ炫舞' },
        { 'value': 'H', 'txt': '宫廷类：如熹妃传、宫廷计' },
        { 'value': 'I', 'txt': '枪战竞技类：如全军出击、刺激战场、穿越火线手游' },
        { 'value': 'J', 'txt': '经营类：如全民小镇、和风物语' },
        { 'value': 'K', 'txt': '其他', 'input': true, 'placeholder': '请填写(不超过300字)' }
      ]
    },
    {
      'iID': 9,
      'iTitle': '哪一类<span style="color:#ff0000;">题材</span>的游戏最吸引你？[可多选]',
      'iType': 'checkbox',
      'iRequired': true,
      'iOptions': [
        { 'value': 'A', 'txt': '历史战争' },
        { 'value': 'B', 'txt': '未来机战' },
        { 'value': 'C', 'txt': '二次元动漫' },
        { 'value': 'D', 'txt': '武侠仙侠' },
        { 'value': 'E', 'txt': '宫廷争斗' },
        { 'value': 'F', 'txt': '宠物饲养' },
        { 'value': 'G', 'txt': '体育经营' },
        { 'value': 'H', 'txt': '城市建设' },
        { 'value': 'I', 'txt': '其他', 'input': true, 'placeholder': '请填写(不超过300字)' }
      ]
    },
    {
      'iID': 10,
      'iTitle': '您觉得如果拿《锦绣未央》和市面上其他女性向手游<span style="color:#ff0000;">相比</span>，是否存在<span style="color:#ff0000;">优势</span>？',
      'iType': 'radio',
      'iRequired': true,
      'iFrom': '',
      'iOptions': [
        { 'value': 'A', 'txt': '有，我很喜欢' },
        { 'value': 'B', 'txt': '有，很多很特别的玩法体验' },
        { 'value': 'C', 'txt': '有，但是玩起来太累了' },
        { 'value': 'D', 'txt': '一般般，都差不多' },
        { 'value': 'E', 'txt': '其他', 'input': true, 'placeholder': '请填写(不超过300字)' }
      ]
    },
    {
      'iID': 11,
      'iTitle': '你觉得《锦绣未央》手游<span style="color:#ff0000;">最吸引你</span>的卖点是？',
      'iType': 'radio',
      'iRequired': true,
      'iOptions': [
        { 'value': 'A', 'txt': '剧情还原' },
        { 'value': 'B', 'txt': '宫斗交互' },
        { 'value': 'C', 'txt': '伙伴养成' },
        { 'value': 'D', 'txt': '捏脸换装' },
        { 'value': 'E', 'txt': '其他', 'input': true, 'placeholder': '请填写(不超过300字)' }
      ]
    },
    {
      'iID': 12,
      'iTitle': '您对<span style="color:#ff0000;">互动玩法</span>有什么建议？[可多选]',
      'iType': 'checkbox',
      'iRequired': true,
      'iFrom': '',
      'iOptions': [
        { 'value': 'A', 'txt': '很满意，无建议' },
        { 'value': 'B', 'txt': '希望增加正面互动效果' },
        { 'value': 'C', 'txt': '希望增加负面互动效果' },
        { 'value': 'D', 'txt': '增加互动种类即可，不介意正面或者负面效果' },
        { 'value': 'E', 'txt': '互动体验感还不够' },
        { 'value': 'F', 'txt': '互动玩法收益太少' },
        { 'value': 'G', 'txt': '其他', 'input': true, 'placeholder': '请填写(不超过300字)' }
      ]
    },
    {
      'iID': 13,
      'iTitle': '您对<span style="color:#ff0000;">情缘</span>有什么意见吗？[可多选]',
      'iType': 'checkbox',
      'iRequired': true,
      'iOptions': [
        { 'value': 'A', 'txt': '很满意，无意见' },
        { 'value': 'B', 'txt': '玩法收益太少' },
        { 'value': 'C', 'txt': '玩法互动性功能少' },
        { 'value': 'D', 'txt': '玩法复杂，玩不明白' },
        { 'value': 'E', 'txt': '其他', 'input': true, 'placeholder': '请填写(不超过300字)' }
      ]
    },
    {
      'iID': 14,
      'iTitle': '您对<span style="color:#ff0000;">飞鸽传书</span>有什么意见吗？[可多选]',
      'iType': 'checkbox',
      'iRequired': true,
      'iOptions': [
        { 'value': 'A', 'txt': '很满意，无意见' },
        { 'value': 'B', 'txt': '玩法收益太少' },
        { 'value': 'C', 'txt': '玩法无聊，缺少趣味性' },
        { 'value': 'D', 'txt': '书信内容无聊' },
        { 'value': 'E', 'txt': '其他', 'input': true, 'placeholder': '请填写(不超过300字)' }
      ]
    },
    {
      'iID': 15,
      'iTitle': '请问目前版本玩法上，您觉得<span style="color:#ff0000;">最需要优化</span>的是那一块？[可多选]',
      'iType': 'checkbox',
      'iRequired': true,
      'iOptions': [
        { 'value': 'A', 'txt': '捏脸换装', 'href': 16 },
        { 'value': 'B', 'txt': '官品晋升', 'href': 17 },
        { 'value': 'C', 'txt': '送花', 'href': 18 },
        { 'value': 'D', 'txt': '花魂', 'href': 19 },
        { 'value': 'E', 'txt': '府邸', 'href': 20 },
        { 'value': 'F', 'txt': '封底管理', 'href': 21 },
        { 'value': 'G', 'txt': '伙伴养成', 'href': 22 },
        { 'value': 'H', 'txt': '都很满意，不需要改进', 'href': 0 }
      ]
    },
    {
      'iID': 16,
      'iTitle': '您觉得<span style="color:#ff0000;">捏脸换装</span>有什么需要改进的地方？[可多选]',
      'iType': 'checkbox',
      'iRequired': true,
      'iFrom': 15,
      'iOptions': [
        { 'value': 'A', 'txt': '服装设计不好看' },
        { 'value': 'B', 'txt': '衣服种类少' },
        { 'value': 'C', 'txt': '捏脸妆容选择少' },
        { 'value': 'D', 'txt': '捏脸系统无法满足您的定制需求' },
        { 'value': 'E', 'txt': '其他', 'input': true, 'placeholder': '请填写(不超过300字)' }
      ]
    },
    {
      'iID': 17,
      'iTitle': '您觉得<span style="color:#ff0000;">官品晋升</span>有什么需要改进的地方？[可多选]',
      'iType': 'checkbox',
      'iRequired': true,
      'iFrom': 15,
      'iOptions': [
        { 'value': 'A', 'txt': '晋升难度大' },
        { 'value': 'B', 'txt': '晋升玩法无聊' },
        { 'value': 'C', 'txt': '朝堂挑战难度大' },
        { 'value': 'D', 'txt': '朝堂挑战玩法无聊' },
        { 'value': 'E', 'txt': '其他', 'input': true, 'placeholder': '请填写(不超过300字)' }
      ]
    },
    {
      'iID': 18,
      'iTitle': '您觉得<span style="color:#ff0000;">送花</span>有什么需要改进的地方？[可多选]',
      'iType': 'checkbox',
      'iRequired': true,
      'iFrom': 15,
      'iOptions': [
        { 'value': 'A', 'txt': '玩法无聊' },
        { 'value': 'B', 'txt': '玩法收益太少' },
        { 'value': 'C', 'txt': '送花种类不够丰富' },
        { 'value': 'D', 'txt': '其他', 'input': true, 'placeholder': '请填写(不超过300字)' }
      ]
    },
    {
      'iID': 19,
      'iTitle': '您觉得<span style="color:#ff0000;">花魂</span>有什么需要改进的地方？[可多选]',
      'iType': 'checkbox',
      'iRequired': true,
      'iFrom': 15,
      'iOptions': [
        { 'value': 'A', 'txt': '获取难度大、掉落概率低' },
        { 'value': 'B', 'txt': '花冢难通关' },
        { 'value': 'C', 'txt': '养成难度大' },
        { 'value': 'D', 'txt': '玩法复杂，玩不明白' },
        { 'value': 'E', 'txt': '其他', 'input': true, 'placeholder': '请填写(不超过300字)' }
      ]
    },
    {
      'iID': 20,
      'iTitle': '您觉得<span style="color:#ff0000;">府邸</span>有什么需要改进的地方？[可多选]',
      'iType': 'checkbox',
      'iRequired': true,
      'iFrom': 15,
      'iOptions': [
        { 'value': 'A', 'txt': '府邸装扮道具种类少' },
        { 'value': 'B', 'txt': '府邸装扮道具不好看' },
        { 'value': 'C', 'txt': '府邸装扮道具无法调整摆放角度' },
        { 'value': 'D', 'txt': '玩法太复杂，玩不明白' },
        { 'value': 'E', 'txt': '玩法无聊' },
        { 'value': 'F', 'txt': '其他', 'input': true, 'placeholder': '请填写(不超过300字)' }
      ]
    },
    {
      'iID': 21,
      'iTitle': '您觉得<span style="color:#ff0000;">封地管理</span>有什么需要改进的地方？[可多选]',
      'iType': 'checkbox',
      'iRequired': true,
      'iFrom': 15,
      'iOptions': [
        { 'value': 'A', 'txt': '玩法无聊' },
        { 'value': 'B', 'txt': '玩法收益太少' },
        { 'value': 'C', 'txt': '封地事件少' },
        { 'value': 'D', 'txt': '封地交互少' },
        { 'value': 'E', 'txt': '封地升级困难' },
        { 'value': 'F', 'txt': '其他', 'input': true, 'placeholder': '请填写(不超过300字)' }
      ]
    },
    {
      'iID': 22,
      'iTitle': '您觉得<span style="color:#ff0000;">伙伴养成</span>有什么需要改进的地方？[可多选]',
      'iType': 'checkbox',
      'iRequired': true,
      'iFrom': 15,
      'iOptions': [
        { 'value': 'A', 'txt': '伙伴收集难度大' },
        { 'value': 'B', 'txt': '伙伴养成难度大' },
        { 'value': 'C', 'txt': '可收集伙伴数量少' },
        { 'value': 'D', 'txt': '伙伴阵容玩法复杂，玩不明白' },
        { 'value': 'E', 'txt': '其他', 'input': true, 'placeholder': '请填写(不超过300字)' }
      ]
    },
    {
      'iID': 23,
      'iTitle': '请问您觉得《锦绣未央》的<span style="color:#ff0000;">剧情</span>怎么样？有没有可以改进的地方？',
      'iType': 'radio',
      'iRequired': true,
      'iOptions': [
        { 'value': 'A', 'txt': '满意，剧情很有意思' },
        { 'value': 'B', 'txt': '一般，还可以' },
        { 'value': 'C', 'txt': '不满意，剧情很无聊' },
        { 'value': 'D', 'txt': '希望增加主角NPC的支线剧情' },
        { 'value': 'E', 'txt': '剧情无所谓' },
        { 'value': 'F', 'txt': '其他', 'input': true, 'placeholder': '请填写(不超过300字)' }
      ]
    },
    {
      'iID': 24,
      'iTitle': '您对我们的游戏的<span style="color:#ff0000;">美术</span>有什么意见吗？',
      'iType': 'radio',
      'iRequired': true,
      'iOptions': [
        { 'value': 'A', 'txt': '很满意，觉得好看' },
        { 'value': 'B', 'txt': '一般，还有上升空间', 'href': 25 },
        { 'value': 'C', 'txt': '不满意，不喜欢', 'href': 25 }
      ]
    },
    {
      'iID': 25,
      'iTitle': '您认为我们的游戏<span style="color:#ff0000;">美术</span>有哪些不足呢？',
      'iType': 'radio',
      'iRequired': true,
      'iFrom': 24,
      'iOptions': [
        { 'value': 'A', 'txt': '游戏主城页面让人眼花缭乱' },
        { 'value': 'B', 'txt': '服饰设计不够精美' },
        { 'value': 'C', 'txt': '人物设计不好看' },
        { 'value': 'D', 'txt': '战斗场景不好看' },
        { 'value': 'E', 'txt': '其他', 'input': true, 'placeholder': '请填写(不超过300字)' }
      ]
    },
    {
      'iID': 26,
      'iTitle': '后续你希望了解到有关《锦绣未央》手游的<span style="color:#ff0000;">资讯</span>是？[可多选]',
      'iType': 'checkbox',
      'iRequired': true,
      'iOptions': [
        { 'value': 'A', 'txt': '游戏策划日常爆料' },
        { 'value': 'B', 'txt': '后续测试、上线进度爆料' },
        { 'value': 'C', 'txt': '相关玩法介绍爆料' },
        { 'value': 'D', 'txt': '游戏美图放送' },
        { 'value': 'E', 'txt': '最新礼包福利' },
        { 'value': 'F', 'txt': '其他', 'input': true, 'placeholder': '请填写(不超过300字)' }
      ]
    },
    {
      'iID': 27,
      'iTitle': '您对于我们《锦绣未央》还有什么意见或建议?',
      'iRemark': '（可附上QQ号，我们筛选出优秀建议并发放丰厚的奖励）',
      'iRequired': false,
      'iType': 'textarea',
      'iOptions': [
        { 'value': '', 'placeholder': '选填(不超过300字)' }
      ]
    }
  ]
}
