<%@ Page Language="c#" MasterPageFile="../masterpages/umbracoDialog.Master"
    AutoEventWireup="True" Inherits="umbraco.dialogs.create" %>

<%@ Import Namespace="Umbraco.Web" %>
<%@ Register Src="../controls/Tree/TreeControl.ascx" TagName="TreeControl" TagPrefix="umbraco" %>
<%@ Register TagPrefix="cc1" Namespace="Umbraco.Web._Legacy.Controls" Assembly="Umbraco.Web" %>
<asp:Content ContentPlaceHolderID="head" runat="server">

    <script language="javascript" type="text/javascript">

        var pageNameHolder = null;
        var pageName = null;

        jQuery(document).ready(function() {
            pageNameHolder = jQuery("#<%=PageNameHolder.ClientID%>");
		    pageName = pageNameHolder.find("p");
        });

		function dialogHandler(id) {
			document.getElementById("nodeId").value = id;
			document.getElementById("ok").disabled = false;
			// Get node name by xmlrequest
			if (id > 0) {
			    umbraco.presentation.webservices.CMSNode.GetNodeName('<%=umbracoUserContextID%>', id, updateName);
				}
			else
				pageName.html("<p><strong><%=Services.TextService.Localize(App)%></strong> <%= Services.TextService.Localize("moveOrCopy/nodeSelected") %></p>");
				pageNameHolder.attr("class","success");
		}

		function updateName(result) {
		    pageName.html("<p><strong>" + result + "</strong> <%= Services.TextService.Localize("moveOrCopy/nodeSelected") %></p>");
			pageNameHolder.attr("class","success");
		}

		function onNodeSelectionConfirmed() {
		    document.location.href = 'create.aspx?nodeType=<%=Request.CleanForXss("nodeType")%>&app=<%=App%>&nodeId=' + document.getElementById('nodeId').value
		}

    </script>

</asp:Content>
<asp:Content ContentPlaceHolderID="body" runat="server">
    <input type="hidden" id="nodeId" name="nodeId" value="<%=Request.CleanForXss("nodeId")%>" />
    <input type="hidden" id="path" name="path" value="" runat="server" />
    <cc1:Pane ID="pane_chooseNode" runat="server" Style="overflow: auto; height: 250px;">
        <umbraco:TreeControl runat="server" ID="JTree" App='<%#App %>'
            IsDialog="true" DialogMode="id" ShowContextMenu="false" FunctionToCall="dialogHandler"
            Height="230"></umbraco:TreeControl>
    </cc1:Pane>
    <asp:Panel runat="server" ID="panel_buttons">
        <cc1:Feedback runat="server" ID="PageNameHolder" type="notice" Style="margin-top: 10px;"
            Text='<%#Services.TextService.Localize("moveOrCopy/noNodeSelected")%>' />
        <div style="padding-top: 10px;" class="guiDialogNormal">
            <input type="button" id="ok" value="<%=Services.TextService.Localize("ok")%>" onclick="onNodeSelectionConfirmed();"
                disabled="true" style="width: 100px" />
            &nbsp; <em>
                <%= Services.TextService.Localize("or") %></em>&nbsp; <a href="#" style="color: blue" onclick="UmbClientMgr.closeModalWindow()">
                    <%=Services.TextService.Localize("cancel")%></a>
        </div>
    </asp:Panel>
    <cc1:Pane ID="pane_chooseName" Visible="false" runat="server">
        <cc1:PropertyPanel runat="server">
            <asp:PlaceHolder ID="phCreate" runat="server"></asp:PlaceHolder>
        </cc1:PropertyPanel>
    </cc1:Pane>
</asp:Content>
