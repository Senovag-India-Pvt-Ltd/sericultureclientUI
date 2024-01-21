import { Card, Button } from 'react-bootstrap';
import Swal from 'sweetalert2/src/sweetalert2.js';

import Layout from '../layout/default';
import { Block, CodePreview } from '../components';

function SweetalertPage() {

    const alertDefault = () =>  {
        Swal.fire({
          title: 'A Simple sweet alert Content'
        });
    };

    const alertSuccess = () =>  {
        Swal.fire({
          icon: 'success',
          title: 'Good job!',
          text: "You clicked the button!",
        });
    };

    const alertInfo = () =>  {
        Swal.fire({
          icon: 'info',
          title: 'Good job!',
          text: "You clicked the button!",
        });
    };

    const alertWarning = () =>  {
        Swal.fire({
          icon: 'warning',
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
        });
    };

    const alertError = () =>  {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        });
    };

    const alertQuestion = () =>  {
        Swal.fire({
          icon: 'question',
          text:'The Internet?',
          title: 'That thing is still around?',
        });
    };

    const alertPositioned = () =>  {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1500
        });
    };

    const alertConfirm = () =>  {
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          if(result.value) {
              Swal.fire('Deleted', 'You successfully deleted this file', 'success')
            } else {
              Swal.fire('Cancelled', 'Your file is still intact', 'info')
            }
        })
    };

    const alertAutoClose = () => {
          Swal.fire({
              title: 'Auto close alert!',
              html: 'I will close in <b></b> milliseconds.',
              timer: 2000,
              timerProgressBar: true,
        });
    };

    const alertAjaxRequest = () => {
        Swal.fire({
            title: 'Submit your Github username',
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Look up',
            showLoaderOnConfirm: true,
            preConfirm: async (name) => {
                try {
                    const response = await fetch(`//api.github.com/users/${name}`);
                    if (!response.ok) {
                        throw new Error(response.statusText);
                    }
                    return await response.json();
                } catch (error) {
                    Swal.showValidationMessage(
                        `Request failed: ${error}`
                    );
                }
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: `${result.value.name}'s avatar`,
                    imageUrl: result.value.avatar_url
                })
            }
        })
  
      };

  return (
    <Layout title="Sweetalert" content="container">
        <Block.Head page>
        <Block.HeadContent>
            <Block.Title>Sweetalert2</Block.Title>
            <Block.Text className="lead">Inside Nioboard, we integrated the <a href="https://sweetalert2.github.io/" target="_blank" rel="noreferrer">SweetAlert2</a> which is beautiful, responsive, highly customizable JavaScript's popup boxes.</Block.Text>
        </Block.HeadContent>
      </Block.Head>

      <Block>
        <Block.Head className="wide-md">
          <Block.HeadContent>
            <Block.Text>
                <strong className="text-black">Note:</strong> When you copy the code example and if you paste your copied code to any other component. these will not work because you just copied the component's name from code example. to use you have to <code>import</code> these component.
            </Block.Text>
            <Block.Text>How to import component and use see the <a href="#docs">docs</a></Block.Text>
            <Block.Title tag="h3">Example</Block.Title>
          </Block.HeadContent>
        </Block.Head>
        <Card>
            <Card.Body>
                <ul className="gap g-3 d-flex flex-wrap">
                    <li><Button variant="primary" onClick={() => alertDefault()}>Default</Button></li>
                    <li><Button variant="success" onClick={() => alertSuccess()}>Success</Button></li>
                    <li><Button variant="info" onClick={() => alertInfo()}>Info</Button></li>
                    <li><Button variant="warning" onClick={() => alertWarning()}>Warning</Button></li>
                    <li><Button variant="danger" onClick={() => alertError()}>Error</Button></li>
                    <li><Button variant="light" onClick={() => alertQuestion()}>Question</Button></li>
                </ul>
            </Card.Body>
            <CodePreview>
                {`import Swal from 'sweetalert2';
                
function DefaultExample() {
    const alertDefault = () =>  {
        Swal.fire({
          title: 'A Simple sweet alert Content'
        });
    };
    return(
        <Button variant="primary" onClick={() => alertDefault()}>Default</Button>
    )
}
export default DefaultExample;
`}
            </CodePreview>
        </Card>
      </Block>

      <Block>
        <Block.Head className="wide-md">
          <Block.HeadContent>
            <Block.Title tag="h3">Advanced Example</Block.Title>
          </Block.HeadContent>
        </Block.Head>
        <Card>
            <Card.Body>
                <ul className="gap g-3 d-flex flex-wrap">
                    <li><Button variant="primary" onClick={() => alertPositioned()}>Positioned dialog</Button></li>
                    <li><Button variant="primary" onClick={() => alertConfirm()}>Confirm button</Button></li>
                    <li><Button variant="primary" onClick={() => alertAutoClose()}>Auto close timer</Button></li>
                    <li><Button variant="primary" onClick={() => alertAjaxRequest()}>Ajax request</Button></li>
                </ul>
            </Card.Body>
            <CodePreview>
                {`import Swal from 'sweetalert2';

function DefaultExample() {
    const alertConfirm = () =>  {
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          if(result.value) {
              Swal.fire('Deleted', 'You successfully deleted this file', 'success')
            } else {
              Swal.fire('Cancelled', 'Your file is still intact', 'info')
            }
        })
    };

    return(
        <Button variant="primary" onClick={() => alertConfirm()}>Confirm button</Button>
    )
}
export default DefaultExample;
`}
            </CodePreview>
        </Card>
      </Block>

    </Layout>
  )
}

export default SweetalertPage;