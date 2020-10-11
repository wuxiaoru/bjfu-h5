const navData = [{
  "data": [{
    "id": 101,
    "type": 'CONTRIBUTOR',
    "authName": "新闻投稿人",
    "path": null,
    "children": [
      {
        "id": 102,
        "authName": "新闻列表",
        "path": 'news-list',
        "children": []
      },
      {
        "id": 103,
        "authName": "新建稿件",
        "path": 'add-manuscript',
        "children": []
      },
    ]
  }, {
    "id": 106,
    "type": 'APPROVE',
    "authName": "新闻审批人",
    "path": null,
    "children": [
      {
        "id": 107,
        "authName": "稿件列表",
        "path": 'doc-list',
        "children": []
      }
    ]
  }, {
    "id": 111,
    "type": 'EDITOR',
    "authName": "新闻编辑人",
    "path": null,
    "children": [
      {
        "id": 112,
        "authName": "稿件列表",
        "path": 'section-list',
        "children": []
      }
    ]
  }, {
    "id": 116,
    "type": 'ADMIN',
    "authName": "系统管理员",
    "path": null,
    "children": [
      {
        "id": 117,
        "authName": "审批人列表",
        "path": "user-list/approver",
        "children": []
      },
      {
        "id": 118,
        "authName": "编辑人列表",
        "path": "user-list/editor",
        "children": []
      },
      {
        "id": 119,
        "authName": "添加审批人",
        "path": "add-user/approver",
        "children": []
      },
      {
        "id": 120,
        "authName": "添加编辑人",
        "path": "add-user/editor",
        "children": []
      }
    ]
  }]
}]
export { navData }