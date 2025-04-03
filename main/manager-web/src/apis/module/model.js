import RequestService from '../httpRequest'
import {getServiceUrl} from '../api'


export default {
    // 获取模型配置列表
    getModelList(params, callback) {
      const queryParams = new URLSearchParams({
        modelType: params.modelType,
        modelName: params.modelName || '',
        page: params.page || 0,
        limit: params.limit || 10
      }).toString();

      RequestService.sendRequest()
        .url(`${getServiceUrl()}/api/v1/models/models/list?${queryParams}`)
        .method('GET')
        .success((res) => {
            RequestService.clearRequestTime()
            callback(res)
        })
        .fail((err) => {
            console.error('获取模型列表失败:', err)
            RequestService.reAjaxFun(() => {
                this.getModelList(params, callback)
            })
        }).send()
    },
    // 获取模型供应器列表
    getModelProviders(modelType, callback) {
      RequestService.sendRequest()
        .url(`${getServiceUrl()}/api/v1/models/${modelType}/provideTypes`)
        .method('GET')
        .success((res) => {
          RequestService.clearRequestTime()
          callback(res.data?.data || [])
        })
        .fail((err) => {
          console.error('获取供应器列表失败:', err)
          this.$message.error('获取供应器列表失败')
          RequestService.reAjaxFun(() => {
            this.getModelProviders(modelType, callback)
          })
        }).send()
    },

    // 新增模型配置
    addModel(params, callback) {
      const { modelType, provideCode, formData } = params;
      const postData = {
        modelCode: formData.modelCode,
        modelName: formData.modelName,
        isDefault: formData.isDefault ? 1 : 0,
        isEnabled: formData.isEnabled ? 1 : 0,
        configJson: JSON.stringify(formData.configJson),
        docLink: formData.docLink,
        remark: formData.remark,
        sort: formData.sort || 0
      };

      RequestService.sendRequest()
        .url(`${getServiceUrl()}/api/v1/models/models/${modelType}/${provideCode}`)
        .method('POST')
        .data(postData)
        .success((res) => {
          RequestService.clearRequestTime()
          callback(res)
        })
        .fail((err) => {
          console.error('新增模型失败:', err)
          this.$message.error(err.msg || '新增模型失败')
          RequestService.reAjaxFun(() => {
            this.addModel(params, callback)
          })
        }).send()
    },

}
