const shareTemplate = `
    <div>
        <ListTopicPattern v-bind:Topics="Topics"></ListTopicPattern>
    </div>
`

const Share = {
    template: shareTemplate,
    data() {
        return {
            Topics: []
        }
    },
    components: {
        "ListTopicPattern": ListTopicPattern,
    },
    methods: {

    },
    mounted: async function () {

        await store.dispatch('topicShare').then((result) => {
            this.Topics = result
        })
        
    }
}