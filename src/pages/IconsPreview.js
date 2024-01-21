import Layout from '../layout/default';
import { Block, PreviewIcon } from '../components';
import iconData from '../store/icons/IconData.js';

function IconsPreviewPage() {
  return (
    <Layout title="Nioicon" content="container">
        <Block.Head page>
        <Block.HeadContent>
            <Block.Title>Nioicon Font</Block.Title>
            <Block.Text className="lead">Nioicon is hand-crafted and beautiful icon set which is designed by Softnio Team. We inspired from google icons and carefuly designed this for NioBoard dashboard. It's have over than 1000+ icons that helps much in your project.</Block.Text>
            <Block.Text>An in-built component can be used to show the icons. Import it to your file. <br />
            Such as <code>import Icon from 'relative_path/icon/Icon.js'</code> use the <code>name</code> props of the <code>Icon</code> to show the specific icon.
            <br /> Example of uses - <code>&lt;Icon name="nioboard"/&gt;</code></Block.Text>
        </Block.HeadContent>
      </Block.Head>

      <Block>
        <PreviewIcon.List>
            {iconData.map((icon) => 
                <PreviewIcon icon={icon} title={icon} key={icon} />
            )}
        </PreviewIcon.List>
      </Block>
    </Layout>
  )
}

export default IconsPreviewPage;