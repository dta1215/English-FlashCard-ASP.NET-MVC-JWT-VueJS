const searchTemplate = `
    <div class="vueTopicContainer">
        <h2>Search Results</h2>
        <ul>
            <li v-for="topic in Topics">
                <router-link v-if="topic.FlashCards.length > 0"  class="playFlashCard" :to="{name: 'Play', params: {id: topic.topicID}}" >{{topic.topicName}}</router-link>
                <router-link v-else style="color: black; text-decoration: none;" class="playFlashCard" to="#" >{{topic.topicName}}</router-link>
            </li>
        </ul>
    </div>
`

const Search = {
    template: searchTemplate,
    data() {
        return {
            isLoading: false,
            Topics: []
        }
    },
    methods: {
        async load() {
            const valuesearch = this.$route.params
            await store.dispatch('search', {
                search: valuesearch
            }).then(async (result) => {
                if (Array.isArray(result)) {
                    this.Topics = result
                }
            })
        }
    },
    mounted: async function () {
        await this.load()
    }
}