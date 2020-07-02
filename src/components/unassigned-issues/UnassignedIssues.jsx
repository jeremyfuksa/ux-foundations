<GithubCard
              key='UN_BLOCKS'
              type='unassigned'
              name='Unassigned UX Blocks'
              icon='🚧'
              iconClass='yellow-avatar'
              blocks={this.state.blocks}
            />
            <GithubCard
              key='UN_REVIEWS'
              type='unassigned'
              icon='⭐️'
              iconClass='green-avatar'
              name='Unassigned UX Reviews'
              blocks={this.state.reviews}
            />
            <GithubCard
              key='UN_INPUT'
              type='unassigned'
              icon='💬'
              iconClass='red-avatar'
              name='Unassigned Design Input'
              blocks={this.state.inputs}
            />